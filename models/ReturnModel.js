const pool = require("../config/database");
const moment = require("moment-timezone");
const Accounts = require("./AccountsModel");

moment.tz.setDefault("Asia/Beirut");

const round2 = (value) =>
    Math.round((Number(value) + Number.EPSILON) * 100) / 100;

/**
 * Customer returns (goods coming back from a customer).
 *
 * ── Accounting ───────────────────────────────────────────────────────────────
 * A return is the exact mirror of the sale it reverses.
 *
 *   Sale (debt):   7011 CREDIT total   /  4111 DEBIT  total (partner = customer)
 *   Return:        7011 DEBIT  total   /  4111 CREDIT total (partner = customer)
 *
 * With NO customer selected (walk-in) there is no receivable to reverse, so the
 * credit goes straight to cash — the goods come back, the cash leaves:
 *
 *   Return:        7011 DEBIT  total   /  531  CREDIT total (partner = null)
 *
 * ── Refund payment ───────────────────────────────────────────────────────────
 * Only meaningful WITH a customer. The return above credits the customer (their
 * balance drops / we owe them). Handing them cash settles that:
 *
 *   Refund:        413  DEBIT  amount (partner = customer)  /  531 CREDIT amount
 *
 * so the customer nets back to zero. It is the exact mirror of a sale payment
 * (which is 531 DEBIT / 413 CREDIT partner=customer).
 *
 * A customer's balance is SUM(debit) - SUM(credit) over journal_items WHERE
 * partner_id_fk = customer, across ALL accounts — so partner_id_fk placement is
 * what actually moves a balance. It is deliberate that the cash lines carry
 * partner_id_fk = null and only the customer-account lines carry the customer.
 *
 * Every query runs on the transaction's `connection` (including account lookups)
 * so a single return never borrows more than one pool slot.
 */
class ReturnModel {
    /** Next RET#### invoice number, on the transaction connection. */
    static async #nextInvoiceNumber(connection) {
        const [[{ number }]] = await connection.query(
            `SELECT IFNULL(MAX(CAST(SUBSTRING(invoice_number, 4) AS UNSIGNED)), 1000) + 1 AS number
             FROM return_orders`,
        );
        return `RET${number.toString().padStart(4, "0")}`;
    }

    /** Next PAY#### voucher number, on the transaction connection. */
    static async #nextPaymentNumber(connection) {
        const [[{ number }]] = await connection.query(
            `SELECT IFNULL(MAX(CAST(SUBSTRING(journal_number, 4) AS UNSIGNED)), 1000) + 1 AS number
             FROM journal_vouchers WHERE journal_number LIKE 'PAY%'`,
        );
        return `PAY${number.toString().padStart(4, "0")}`;
    }

    /**
     * Posts the return's own journal voucher and returns its id.
     * 7011 DEBIT total, and CREDIT to the customer (4111) or to cash (531).
     */
    static async #postReturnJournal(connection, order) {
        const [voucher] = await connection.query(
            `INSERT INTO journal_vouchers (journal_number, journal_date, journal_description, total_value)
             VALUES (?, ?, ?, ?)`,
            [order.invoice_number, order.order_datetime, "Return", order.total_amount],
        );
        const journal_id_fk = voucher.insertId;

        const base = {
            journal_id_fk,
            journal_date: order.order_datetime,
            reference_number: order.invoice_number,
            currency: "USD",
            exchange_value: order.exchange_rate,
        };

        // Goods come back: reverse the sale's revenue credit.
        const [_7011] = await Accounts.getIdByAccountNumber("7011", connection);
        await connection.query(`INSERT INTO journal_items SET ?`, {
            ...base,
            account_id_fk: _7011.id,
            partner_id_fk: null,
            debit: order.total_amount,
            credit: 0,
        });

        if (order.customer_id) {
            // Reverse the debt: credit the customer's receivable.
            const [_4111] = await Accounts.getIdByAccountNumber("4111", connection);
            await connection.query(`INSERT INTO journal_items SET ?`, {
                ...base,
                account_id_fk: _4111.id,
                partner_id_fk: order.customer_id,
                debit: 0,
                credit: order.total_amount,
            });
        } else {
            // No customer: cash leaves the drawer instead.
            const [_531] = await Accounts.getIdByAccountNumber("531", connection);
            await connection.query(`INSERT INTO journal_items SET ?`, {
                ...base,
                account_id_fk: _531.id,
                partner_id_fk: null,
                debit: 0,
                credit: order.total_amount,
            });
        }

        return journal_id_fk;
    }

    /**
     * Posts a refund voucher: cash out, customer debited so the return's credit
     * is settled. Only valid with a customer (a no-customer return already paid
     * out via the 531 credit above — refunding again would double count).
     */
    static async #postRefundJournal(connection, order, amount, payment_date_in) {
        const payment_number = await this.#nextPaymentNumber(connection);
        const payment_date = moment(payment_date_in || order.order_datetime).format(
            "YYYY-MM-DD HH:mm:ss",
        );
        const payment = { amount };

        const [voucher] = await connection.query(
            `INSERT INTO journal_vouchers (journal_number, journal_date, journal_description, total_value)
             VALUES (?, ?, ?, ?)`,
            [payment_number, payment_date, "Return Payment", payment.amount],
        );

        const base = {
            journal_id_fk: voucher.insertId,
            journal_date: payment_date,
            reference_number: order.invoice_number,
            currency: "USD",
            exchange_value: order.exchange_rate,
        };

        // Cash leaves the system.
        const [_531] = await Accounts.getIdByAccountNumber("531", connection);
        await connection.query(`INSERT INTO journal_items SET ?`, {
            ...base,
            account_id_fk: _531.id,
            partner_id_fk: null,
            debit: 0,
            credit: payment.amount,
        });

        // Customer is debited, settling the credit the return gave them.
        const [_413] = await Accounts.getIdByAccountNumber("413", connection);
        await connection.query(`INSERT INTO journal_items SET ?`, {
            ...base,
            account_id_fk: _413.id,
            partner_id_fk: order.customer_id,
            debit: payment.amount,
            credit: 0,
        });

        return voucher.insertId;
    }

    /**
     * Resolves the refund to post: only valid with a customer and a positive
     * amount, and never more than the return itself is worth.
     *
     * Refunding more than the return total would hand back cash that was never
     * credited, leaving the customer with a fabricated credit balance — so it is
     * rejected rather than clamped: silently altering an amount someone typed is
     * worse than failing the request. This throws inside the transaction, so the
     * whole return rolls back cleanly.
     */
    static #refundFor(order, amount) {
        const value = round2(Number(amount) || 0);
        if (!order.customer_id || value <= 0) return 0;

        const total = round2(Number(order.total_amount) || 0);
        if (value > total) {
            throw new Error(
                `Refund (${value}) cannot exceed the return total (${total})`,
            );
        }
        return value;
    }

    /** Inserts the return's line items. */
    static async #insertItems(connection, order_id, items) {
        if (!items?.length) return;

        // A zero/negative return line is meaningless and would corrupt stock:
        // reject inside the transaction so nothing is committed.
        const bad = items.find((item) => !((Number(item.quantity) || 0) > 0));
        if (bad) {
            throw new Error(
                `Return quantity must be greater than zero (product ${bad.product_id})`,
            );
        }

        const rows = items.map((item) => [
            order_id,
            item.product_id,
            item.variant_id ?? null,
            item.quantity,
            item.unit_price,
            item.unit_cost,
            Number(item.quantity) * Number(item.unit_price),
            item.price_type || "unit_price_usd",
        ]);
        await connection.query(
            `INSERT INTO return_order_items
                (order_id, product_id, variant_id, quantity, unit_price, unit_cost, total_price, price_type)
             VALUES ?`,
            [rows],
        );
    }

    /**
     * Returned goods go BACK into stock: positive quantity, type 'RETURN'.
     * Linked by order_id_fk so an edit/delete can reverse them precisely.
     */
    static async #addInventory(connection, order_id, invoice_number, items) {
        const stocked = (items || []).filter((i) => i.stock_management == 1);
        if (!stocked.length) return;

        const rows = stocked.map((item) => [
            item.product_id,
            item.variant_id ?? null,
            item.quantity,
            order_id,
            invoice_number,
        ]);
        await connection.query(
            `INSERT INTO inventory_transactions
                (product_id_fk, variant_id, quantity, transaction_type, order_id_fk, transaction_notes)
             VALUES ?`,
            [rows.map((r) => [r[0], r[1], r[2], "RETURN", r[3], r[4]])],
        );
    }

    /** Removes this return's stock movements (used by edit + delete). */
    static async #clearInventory(connection, order_id) {
        await connection.query(
            `DELETE FROM inventory_transactions
             WHERE order_id_fk = ? AND transaction_type = 'RETURN'`,
            [order_id],
        );
    }

    /** Removes a voucher and its items (used by edit + delete). */
    static async #clearJournal(connection, journal_voucher_id) {
        if (!journal_voucher_id) return;
        await connection.query(`DELETE FROM journal_items WHERE journal_id_fk = ?`, [
            journal_voucher_id,
        ]);
        await connection.query(`DELETE FROM journal_vouchers WHERE journal_id = ?`, [
            journal_voucher_id,
        ]);
    }

    // ── public API ───────────────────────────────────────────────────────────

    /**
     * @param {object} order  { customer_id, order_datetime, order_notes, total_amount, total_cost, exchange_rate }
     * @param {array}  items  [{ product_id, variant_id, quantity, unit_price, unit_cost, price_type, stock_management }]
     * @param {object|null} payment { amount, payment_date } — refund; requires a customer.
     */
    static async createReturn(order, items, payment) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            order.order_datetime = moment(order.order_datetime).format(
                "YYYY-MM-DD HH:mm:ss",
            );
            order.invoice_number = await this.#nextInvoiceNumber(connection);
            order.journal_voucher_id = await this.#postReturnJournal(connection, order);

            // Refund (if any) is posted as its own voucher, recorded on the return
            // so a later edit/delete can re-post or remove it.
            const refund = this.#refundFor(order, payment?.amount);
            order.refund_amount = refund;
            order.refund_date = refund
                ? moment(payment?.payment_date || order.order_datetime).format(
                      "YYYY-MM-DD HH:mm:ss",
                  )
                : null;
            order.refund_voucher_id = refund
                ? await this.#postRefundJournal(
                      connection,
                      order,
                      refund,
                      order.refund_date,
                  )
                : null;

            const [result] = await connection.query(
                `INSERT INTO return_orders SET ?`,
                order,
            );
            const order_id = result.insertId;

            await this.#insertItems(connection, order_id, items);
            await this.#addInventory(connection, order_id, order.invoice_number, items);

            await connection.commit();
            return { order_id, invoice_number: order.invoice_number };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /**
     * Rewrites a return in place: the old journal + stock movements + items are
     * removed and re-posted from the submitted state, keeping the same order_id
     * and invoice_number.
     */
    static async updateReturn(order_id, order, items) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [[existing]] = await connection.query(
                `SELECT * FROM return_orders WHERE order_id = ? AND is_deleted = 0`,
                [order_id],
            );
            if (!existing) throw new Error("Return not found");

            await this.#clearInventory(connection, order_id);
            await this.#clearJournal(connection, existing.journal_voucher_id);
            await this.#clearJournal(connection, existing.refund_voucher_id);
            await connection.query(
                `DELETE FROM return_order_items WHERE order_id = ?`,
                [order_id],
            );

            const next = {
                invoice_number: existing.invoice_number,
                customer_id: order.customer_id ?? null,
                order_datetime: moment(
                    order.order_datetime || existing.order_datetime,
                ).format("YYYY-MM-DD HH:mm:ss"),
                order_notes: order.order_notes ?? null,
                total_amount: order.total_amount,
                total_cost: order.total_cost,
                exchange_rate: existing.exchange_rate,
            };
            next.journal_voucher_id = await this.#postReturnJournal(connection, next);

            // Re-post the refund from the submitted amount, falling back to what
            // the return already carried. #refundFor validates it against the NEW
            // total, so lowering the total below a stale refund fails loudly
            // instead of leaving the customer with a fabricated balance.
            // Dropping the customer drops the refund.
            const refund = this.#refundFor(
                next,
                order.refund_amount ?? existing.refund_amount,
            );
            const previousRefund = round2(Number(existing.refund_amount) || 0);

            // Keep the original refund date when the amount is unchanged — an
            // unrelated edit must not move the cash movement into another
            // accounting period. A changed/new refund is stamped when it happens.
            next.refund_amount = refund;
            next.refund_date = refund
                ? refund === previousRefund && existing.refund_date
                    ? moment(existing.refund_date).format("YYYY-MM-DD HH:mm:ss")
                    : moment().format("YYYY-MM-DD HH:mm:ss")
                : null;
            next.refund_voucher_id = refund
                ? await this.#postRefundJournal(
                      connection,
                      next,
                      refund,
                      next.refund_date,
                  )
                : null;

            await connection.query(
                `UPDATE return_orders SET ? WHERE order_id = ?`,
                [
                    {
                        ...next,
                        updated_at: moment().format("YYYY-MM-DD HH:mm:ss"),
                        update_reason: order.update_reason ?? null,
                    },
                    order_id,
                ],
            );

            await this.#insertItems(connection, order_id, items);
            await this.#addInventory(connection, order_id, next.invoice_number, items);

            await connection.commit();
            return { order_id, invoice_number: next.invoice_number };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    /** Soft-deletes the return and undoes its stock + journal effects. */
    static async deleteReturn(order_id, reason) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            const [[existing]] = await connection.query(
                `SELECT * FROM return_orders WHERE order_id = ? AND is_deleted = 0`,
                [order_id],
            );
            if (!existing) throw new Error("Return not found");

            await this.#clearInventory(connection, order_id);
            await this.#clearJournal(connection, existing.journal_voucher_id);
            await this.#clearJournal(connection, existing.refund_voucher_id);

            await connection.query(
                `UPDATE return_order_items SET is_deleted = 1 WHERE order_id = ?`,
                [order_id],
            );
            await connection.query(
                `UPDATE return_orders
                 SET is_deleted = 1, deleted_at = ?, delete_reason = ?
                 WHERE order_id = ?`,
                [moment().format("YYYY-MM-DD HH:mm:ss"), reason ?? null, order_id],
            );

            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getReturnById(order_id) {
        const [[row]] = await pool.query(
            `SELECT * FROM return_orders WHERE order_id = ?`,
            [order_id],
        );
        return row;
    }
}

module.exports = ReturnModel;
