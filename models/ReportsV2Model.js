const pool = require("../config/database");
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Beirut");

const num = (v) => Number(v) || 0;
const round2 = (v) => Math.round((num(v) + Number.EPSILON) * 100) / 100;

/**
 * Reports v2 — one aggregate query set per report page, so every card on a page
 * is derived from the same facts and can never drift apart.
 *
 * ── Financial definitions (source of truth, agreed 2026-07-16) ──────────────
 *  Sales Revenue   = SUM(sales_orders.total_amount)         — NET of the
 *                    order-level discount (total_amount is already net;
 *                    subtotal_amount is the pre-discount gross).
 *  Total Returns   = SUM(return_orders.total_amount)
 *  Net Sales       = Sales Revenue − Total Returns
 *  Sales Profit    = SUM(sales_orders.total_amount − total_cost)   [order level]
 *  Returned Profit = SUM(return_orders.total_amount − total_cost)
 *  Net Profit      = Sales Profit − Returned Profit
 *  Discounts Given = SUM(subtotal_amount − total_amount)
 *
 *  Item-level pages (products/segments) must NOT sum raw line totals — they
 *  multiply each line by (1 − discount/100), which reconciles exactly with the
 *  order totals because the discount is a straight percentage of the subtotal.
 *
 * All date filtering is sargable: [from 00:00, toExclusive 00:00) — never
 * DATE(col) = / BETWEEN on the column. mysql2 returns DECIMAL as strings, so
 * every number is coerced before leaving this model: responses are render-ready.
 */
class ReportsV2Model {
    /** Normalises a {from,to} pair into sargable datetime bounds. */
    static #bounds(from, to) {
        const start = moment(from).startOf("day");
        const endExclusive = moment(to).startOf("day").add(1, "day");
        if (!start.isValid() || !endExclusive.isValid()) {
            throw new Error("Invalid date range");
        }
        return {
            start: start.format("YYYY-MM-DD HH:mm:ss"),
            endExclusive: endExclusive.format("YYYY-MM-DD HH:mm:ss"),
            days: endExclusive.diff(start, "days"),
        };
    }

    /**
     * Picks the trend bucket granularity from the range length:
     * single day → hourly, up to ~2 months → daily, beyond → monthly.
     */
    static #granularity(days) {
        if (days <= 1) return "hour";
        if (days <= 62) return "day";
        return "month";
    }

    static #bucketExpr(granularity, column) {
        switch (granularity) {
            case "hour":
                return `DATE_FORMAT(${column}, '%Y-%m-%d %H:00')`;
            case "month":
                return `DATE_FORMAT(${column}, '%Y-%m')`;
            default:
                return `DATE_FORMAT(${column}, '%Y-%m-%d')`;
        }
    }

    /** KPI aggregates for one period — single round trip, two small scans. */
    static async #kpis(start, endExclusive) {
        const query = `
            SELECT
                (SELECT COALESCE(SUM(total_amount), 0)
                    FROM sales_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS sales_revenue,
                (SELECT COALESCE(SUM(total_amount - total_cost), 0)
                    FROM sales_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS sales_profit,
                (SELECT COALESCE(SUM(subtotal_amount - total_amount), 0)
                    FROM sales_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS discounts_given,
                (SELECT COUNT(*)
                    FROM sales_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS orders_count,
                (SELECT COALESCE(SUM(total_amount), 0)
                    FROM return_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS total_returns,
                (SELECT COALESCE(SUM(total_amount - total_cost), 0)
                    FROM return_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS returned_profit,
                (SELECT COUNT(*)
                    FROM return_orders
                    WHERE order_datetime >= ? AND order_datetime < ?
                    AND is_deleted = 0)                                   AS returns_count`;

        const p = [start, endExclusive];
        const [[row]] = await pool.query(query, [
            ...p, ...p, ...p, ...p, ...p, ...p, ...p,
        ]);

        const sales_revenue = round2(row.sales_revenue);
        const total_returns = round2(row.total_returns);
        const sales_profit = round2(row.sales_profit);
        const returned_profit = round2(row.returned_profit);
        const orders_count = num(row.orders_count);

        return {
            sales_revenue,
            total_returns,
            net_sales: round2(sales_revenue - total_returns),
            sales_profit,
            returned_profit,
            net_profit: round2(sales_profit - returned_profit),
            discounts_given: round2(row.discounts_given),
            orders_count,
            returns_count: num(row.returns_count),
            avg_order_value: orders_count
                ? round2(sales_revenue / orders_count)
                : 0,
            returns_rate: sales_revenue
                ? round2((total_returns / sales_revenue) * 100)
                : 0,
        };
    }

    /** Revenue + profit per time bucket for sales and returns, merged in order. */
    static async #trend(start, endExclusive, granularity) {
        const salesBucket = this.#bucketExpr(granularity, "order_datetime");

        const [sales] = await pool.query(
            `SELECT ${salesBucket} AS bucket,
                COALESCE(SUM(total_amount), 0) AS revenue,
                COALESCE(SUM(total_amount - total_cost), 0) AS profit
             FROM sales_orders
             WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0
             GROUP BY bucket ORDER BY bucket`,
            [start, endExclusive],
        );
        const [returns] = await pool.query(
            `SELECT ${salesBucket} AS bucket,
                COALESCE(SUM(total_amount), 0) AS revenue,
                COALESCE(SUM(total_amount - total_cost), 0) AS profit
             FROM return_orders
             WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0
             GROUP BY bucket ORDER BY bucket`,
            [start, endExclusive],
        );

        // Merge on bucket key: net figures per bucket. Small arrays — this is
        // shaping, not aggregation; the sums already happened in SQL.
        const byBucket = new Map();
        for (const row of sales) {
            byBucket.set(row.bucket, {
                bucket: row.bucket,
                revenue: round2(row.revenue),
                net_profit: round2(row.profit),
            });
        }
        for (const row of returns) {
            const entry = byBucket.get(row.bucket) ?? {
                bucket: row.bucket,
                revenue: 0,
                net_profit: 0,
            };
            entry.revenue = round2(entry.revenue - num(row.revenue));
            entry.net_profit = round2(entry.net_profit - num(row.profit));
            byBucket.set(row.bucket, entry);
        }
        return [...byBucket.values()].sort((a, b) =>
            a.bucket.localeCompare(b.bucket),
        );
    }

    /** Largest sales and returns of the period, for the overview tables. */
    static async #outliers(start, endExclusive, limit = 5) {
        const [orders] = await pool.query(
            `SELECT O.order_id, O.invoice_number, O.order_datetime,
                O.total_amount, O.discount, A.name AS customer_name
             FROM sales_orders O
             LEFT JOIN accounts A ON O.customer_id = A.account_id
             WHERE O.order_datetime >= ? AND O.order_datetime < ?
                AND O.is_deleted = 0
             ORDER BY O.total_amount DESC
             LIMIT ${Number(limit)}`,
            [start, endExclusive],
        );
        const [returns] = await pool.query(
            `SELECT R.order_id, R.invoice_number, R.order_datetime,
                R.total_amount, A.name AS customer_name
             FROM return_orders R
             LEFT JOIN accounts A ON R.customer_id = A.account_id
             WHERE R.order_datetime >= ? AND R.order_datetime < ?
                AND R.is_deleted = 0
             ORDER BY R.total_amount DESC
             LIMIT ${Number(limit)}`,
            [start, endExclusive],
        );

        const shape = (rows) =>
            rows.map((r) => ({
                order_id: r.order_id,
                invoice_number: r.invoice_number,
                order_datetime: r.order_datetime,
                total_amount: round2(r.total_amount),
                discount: r.discount !== undefined ? num(r.discount) : undefined,
                customer_name: r.customer_name ?? null,
            }));
        return { largest_orders: shape(orders), largest_returns: shape(returns) };
    }

    /**
     * The Sales Overview page payload. `compare` (optional {from,to}) adds a
     * second KPI set for the same metrics so the client can render deltas.
     */
    static async getOverview({ from, to, compare }) {
        const { start, endExclusive, days } = this.#bounds(from, to);
        const granularity = this.#granularity(days);

        const [kpis, trend, outliers] = await Promise.all([
            this.#kpis(start, endExclusive),
            this.#trend(start, endExclusive, granularity),
            this.#outliers(start, endExclusive),
        ]);

        let comparison = null;
        if (compare?.from && compare?.to) {
            const bounds = this.#bounds(compare.from, compare.to);
            comparison = await this.#kpis(bounds.start, bounds.endExclusive);
        }

        return { range: { from, to }, granularity, kpis, comparison, trend, ...outliers };
    }

    // ─────────────────────────────────────────────────────────────────────
    // Shared SQL fragments.
    //
    // NET line revenue: the order-level discount is a straight percentage of
    // the subtotal, so scaling every line by (1 − discount/100) allocates it
    // EXACTLY — item-level sums reconcile to the cent with order-level totals.
    // Line profit = net line revenue − (qty × unit_cost snapshot).
    static #NET = `(SOI.total_price * (1 - COALESCE(O.discount, 0) / 100))`;
    static #LINE_PROFIT = `(SOI.total_price * (1 - COALESCE(O.discount, 0) / 100) - SOI.quantity * COALESCE(SOI.unit_cost, 0))`;
    // Segment bucket: product → category → category_groups. LEFT JOINs so
    // products with no category/group land in 'unclassified' instead of
    // silently vanishing (the legacy report's INNER JOIN bug).
    static #SEGMENT = `CASE WHEN G.group_id = 1 THEN 'petshop' WHEN G.group_id = 2 THEN 'medical' ELSE 'unclassified' END`;
    static #ITEM_JOINS = `
            FROM sales_order_items SOI
            INNER JOIN sales_orders O ON O.order_id = SOI.order_id
            INNER JOIN products P ON P.product_id = SOI.product_id
            LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
            LEFT JOIN category_groups G ON C.group_id_fk = G.group_id`;
    static #ITEM_WHERE = `
            WHERE O.order_datetime >= ? AND O.order_datetime < ?
            AND O.is_deleted = 0 AND IFNULL(SOI.is_deleted, 0) = 0`;
    static #RETURN_JOINS = `
            FROM return_order_items SOI
            INNER JOIN return_orders O ON O.order_id = SOI.order_id
            INNER JOIN products P ON P.product_id = SOI.product_id
            LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
            LEFT JOIN category_groups G ON C.group_id_fk = G.group_id`;

    // ─────────────────────── Financial Overview ──────────────────────────

    static async getFinancial({ from, to }) {
        const { start, endExclusive } = this.#bounds(from, to);
        const p = [start, endExclusive];

        const kpisPromise = this.#kpis(start, endExclusive);

        const factsPromise = pool.query(
            `SELECT
                (SELECT COALESCE(SUM(total_cost), 0) FROM sales_orders
                    WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0) AS sales_cogs,
                (SELECT COALESCE(SUM(total_cost), 0) FROM return_orders
                    WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0) AS returns_cogs,
                (SELECT COALESCE(SUM(total_value), 0) FROM journal_vouchers
                    WHERE journal_number LIKE 'EXP%' AND is_deleted = 0
                    AND journal_date >= ? AND journal_date < ?) AS expenses,
                (SELECT COALESCE(SUM(total_value), 0) FROM journal_vouchers
                    WHERE journal_number LIKE 'REC%' AND is_deleted = 0
                    AND journal_date >= ? AND journal_date < ?) AS supplier_payments,
                (SELECT COALESCE(SUM(total_value), 0) FROM journal_vouchers
                    WHERE journal_number LIKE 'PAY%' AND journal_description = 'Payment'
                    AND is_deleted = 0
                    AND journal_date >= ? AND journal_date < ?) AS customer_payments,
                (SELECT COALESCE(SUM(total_value), 0) FROM journal_vouchers
                    WHERE journal_description = 'Return Payment' AND is_deleted = 0
                    AND journal_date >= ? AND journal_date < ?) AS refunds_paid,
                (SELECT COALESCE(SUM(total_cost), 0) FROM purchase_orders
                    WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0) AS purchases`,
            [...p, ...p, ...p, ...p, ...p, ...p, ...p],
        );

        const splitPromise = pool.query(
            `SELECT COALESCE(operation_type, 'unspecified') AS method,
                COUNT(*) AS orders_count,
                COALESCE(SUM(total_amount), 0) AS amount
             FROM sales_orders
             WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0
             GROUP BY COALESCE(operation_type, 'unspecified')`,
            p,
        );

        const [kpis, [[facts]], [split]] = await Promise.all([
            kpisPromise,
            factsPromise,
            splitPromise,
        ]);

        const cogs_net = round2(num(facts.sales_cogs) - num(facts.returns_cogs));
        return {
            range: { from, to },
            kpis,
            // Waterfall: Revenue − Returns = Net Sales − net COGS = Net Profit.
            waterfall: {
                revenue: kpis.sales_revenue,
                returns: kpis.total_returns,
                net_sales: kpis.net_sales,
                cogs: cogs_net,
                net_profit: kpis.net_profit,
            },
            facts: {
                expenses: round2(facts.expenses),
                supplier_payments: round2(facts.supplier_payments),
                customer_payments: round2(facts.customer_payments),
                refunds_paid: round2(facts.refunds_paid),
                purchases: round2(facts.purchases),
                discounts_given: kpis.discounts_given,
            },
            payment_split: split.map((row) => ({
                method: row.method,
                orders_count: num(row.orders_count),
                amount: round2(row.amount),
            })),
        };
    }

    // ─────────────────────── Petshop vs Medical ──────────────────────────

    static async getSegments({ from, to }) {
        const { start, endExclusive, days } = this.#bounds(from, to);
        const granularity = this.#granularity(days);
        const p = [start, endExclusive];

        const salesPromise = pool.query(
            `SELECT ${this.#SEGMENT} AS segment,
                COALESCE(SUM(${this.#NET}), 0) AS revenue,
                COALESCE(SUM(${this.#LINE_PROFIT}), 0) AS profit,
                COALESCE(SUM(SOI.quantity), 0) AS qty
             ${this.#ITEM_JOINS} ${this.#ITEM_WHERE}
             GROUP BY segment`,
            p,
        );
        // Returns carry no order-level discount — raw line totals are correct.
        const returnsPromise = pool.query(
            `SELECT ${this.#SEGMENT} AS segment,
                COALESCE(SUM(SOI.total_price), 0) AS returns_value,
                COALESCE(SUM(SOI.total_price - SOI.quantity * COALESCE(SOI.unit_cost, 0)), 0) AS returned_profit
             ${this.#RETURN_JOINS}
             WHERE O.order_datetime >= ? AND O.order_datetime < ?
             AND O.is_deleted = 0 AND IFNULL(SOI.is_deleted, 0) = 0
             GROUP BY segment`,
            p,
        );
        const bucket = this.#bucketExpr(granularity, 'O.order_datetime');
        const trendPromise = pool.query(
            `SELECT ${bucket} AS bucket, ${this.#SEGMENT} AS segment,
                COALESCE(SUM(${this.#NET}), 0) AS revenue
             ${this.#ITEM_JOINS} ${this.#ITEM_WHERE}
             GROUP BY bucket, segment ORDER BY bucket`,
            p,
        );
        const topFor = (groupFilter) =>
            pool.query(
                `SELECT P.product_id, P.product_name,
                    COALESCE(SUM(${this.#NET}), 0) AS revenue,
                    COALESCE(SUM(${this.#LINE_PROFIT}), 0) AS profit,
                    COALESCE(SUM(SOI.quantity), 0) AS qty
                 ${this.#ITEM_JOINS} ${this.#ITEM_WHERE}
                 AND ${groupFilter}
                 GROUP BY P.product_id
                 ORDER BY revenue DESC LIMIT 5`,
                p,
            );

        const [[sales], [returns], [trendRows], [topShop], [topMedical]] =
            await Promise.all([
                salesPromise,
                returnsPromise,
                trendPromise,
                topFor('G.group_id = 1'),
                topFor('G.group_id = 2'),
            ]);

        const segments = {};
        for (const key of ['petshop', 'medical', 'unclassified']) {
            segments[key] = {
                revenue: 0, profit: 0, qty: 0, returns_value: 0, returned_profit: 0,
            };
        }
        for (const row of sales) {
            Object.assign(segments[row.segment], {
                revenue: round2(row.revenue),
                profit: round2(row.profit),
                qty: num(row.qty),
            });
        }
        for (const row of returns) {
            Object.assign(segments[row.segment], {
                returns_value: round2(row.returns_value),
                returned_profit: round2(row.returned_profit),
            });
        }

        // trend → one row per bucket with a column per segment
        const trendMap = new Map();
        for (const row of trendRows) {
            const entry = trendMap.get(row.bucket) ?? {
                bucket: row.bucket, petshop: 0, medical: 0, unclassified: 0,
            };
            entry[row.segment] = round2(row.revenue);
            trendMap.set(row.bucket, entry);
        }

        const shapeTop = (rows) =>
            rows.map((r) => ({
                product_id: r.product_id,
                product_name: r.product_name,
                revenue: round2(r.revenue),
                profit: round2(r.profit),
                qty: num(r.qty),
            }));

        return {
            range: { from, to },
            granularity,
            segments,
            trend: [...trendMap.values()].sort((a, b) =>
                a.bucket.localeCompare(b.bucket),
            ),
            top_products: {
                petshop: shapeTop(topShop),
                medical: shapeTop(topMedical),
            },
        };
    }

    // ─────────────────── Product & Category Analytics ────────────────────

    static #PRODUCT_SORTS = {
        product_name: 'P.product_name',
        category_name: 'category_name',
        qty_sold: 'qty_sold',
        revenue: 'revenue',
        profit: 'profit',
        margin: 'margin',
        returns_value: 'returns_value',
    };

    static async getProductsTable({
        from, to, page = 0, pageSize = 25, sortField = 'revenue',
        sortOrder = -1, search = null,
    }) {
        const { start, endExclusive } = this.#bounds(from, to);
        const orderBy = this.#PRODUCT_SORTS[sortField] ?? 'revenue';
        const direction = Number(sortOrder) === 1 ? 'ASC' : 'DESC';
        const limit = Math.min(Math.max(Number(pageSize) || 25, 1), 200);
        const offset = Math.max(Number(page) || 0, 0) * limit;

        const params = [start, endExclusive];
        let searchClause = '';
        if (search) {
            searchClause = ` AND (P.product_name LIKE ? OR P.barcode LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        const rowsPromise = pool.query(
            `SELECT P.product_id, P.product_name, P.barcode,
                C.category_name, ${this.#SEGMENT} AS segment,
                COALESCE(SUM(SOI.quantity), 0) AS qty_sold,
                COALESCE(SUM(${this.#NET}), 0) AS revenue,
                COALESCE(SUM(${this.#LINE_PROFIT}), 0) AS profit,
                COALESCE(SUM(${this.#LINE_PROFIT}) / NULLIF(SUM(${this.#NET}), 0) * 100, 0) AS margin,
                COALESCE(R.returns_value, 0) AS returns_value
             ${this.#ITEM_JOINS}
             LEFT JOIN (
                SELECT RI.product_id, SUM(RI.total_price) AS returns_value
                FROM return_order_items RI
                INNER JOIN return_orders RO ON RO.order_id = RI.order_id
                WHERE RO.order_datetime >= ? AND RO.order_datetime < ?
                    AND RO.is_deleted = 0 AND IFNULL(RI.is_deleted, 0) = 0
                GROUP BY RI.product_id
             ) R ON R.product_id = P.product_id
             ${this.#ITEM_WHERE} ${searchClause}
             GROUP BY P.product_id
             ORDER BY ${orderBy} ${direction}
             LIMIT ${limit} OFFSET ${offset}`,
            [start, endExclusive, ...params],
        );
        const countPromise = pool.query(
            `SELECT COUNT(DISTINCT P.product_id) AS total
             ${this.#ITEM_JOINS} ${this.#ITEM_WHERE} ${searchClause}`,
            params,
        );

        const [[rows], [[{ total }]]] = await Promise.all([
            rowsPromise, countPromise,
        ]);

        return {
            range: { from, to },
            total: num(total),
            rows: rows.map((r) => ({
                product_id: r.product_id,
                product_name: r.product_name,
                barcode: r.barcode,
                category_name: r.category_name ?? '—',
                segment: r.segment,
                qty_sold: num(r.qty_sold),
                revenue: round2(r.revenue),
                profit: round2(r.profit),
                margin: round2(r.margin),
                returns_value: round2(r.returns_value),
            })),
        };
    }

    static async getProductsInsights({ from, to }) {
        const { start, endExclusive, days } = this.#bounds(from, to);
        const p = [start, endExclusive];

        // previous period of the same length, for top movers
        const prevStart = moment(start).subtract(days, 'days').format('YYYY-MM-DD HH:mm:ss');
        const prevEnd = start;

        const categoriesPromise = pool.query(
            `SELECT COALESCE(C.category_name, 'Uncategorised') AS category_name,
                COALESCE(G.group_name, 'Unclassified') AS group_name,
                C.category_id,
                COALESCE(SUM(SOI.quantity), 0) AS qty_sold,
                COALESCE(SUM(${this.#NET}), 0) AS revenue,
                COALESCE(SUM(${this.#LINE_PROFIT}), 0) AS profit
             ${this.#ITEM_JOINS} ${this.#ITEM_WHERE}
             GROUP BY C.category_id
             ORDER BY revenue DESC`,
            p,
        );
        const perProduct = (a, b) =>
            pool.query(
                `SELECT P.product_id, P.product_name,
                    COALESCE(SUM(${this.#NET}), 0) AS revenue
                 ${this.#ITEM_JOINS} ${this.#ITEM_WHERE}
                 GROUP BY P.product_id`,
                [a, b],
            );

        const [[categories], [current], [previous]] = await Promise.all([
            categoriesPromise,
            perProduct(start, endExclusive),
            perProduct(prevStart, prevEnd),
        ]);

        // movers: merge current vs previous revenue per product
        const prevMap = new Map(previous.map((r) => [r.product_id, num(r.revenue)]));
        const movers = current.map((r) => {
            const prev = prevMap.get(r.product_id) ?? 0;
            return {
                product_id: r.product_id,
                product_name: r.product_name,
                revenue: round2(r.revenue),
                previous_revenue: round2(prev),
                change: round2(num(r.revenue) - prev),
            };
        });
        for (const [id, prev] of prevMap) {
            if (!current.some((c) => c.product_id === id) && prev > 0) {
                const name = previous.find((r) => r.product_id === id)?.product_name;
                movers.push({
                    product_id: id, product_name: name,
                    revenue: 0, previous_revenue: round2(prev), change: round2(-prev),
                });
            }
        }
        movers.sort((a, b) => b.change - a.change);
        const gainers = movers.filter((m) => m.change > 0).slice(0, 5);
        const decliners = movers.filter((m) => m.change < 0).slice(-5).reverse();

        // Pareto/ABC: cumulative revenue share, A ≤ 80%, B ≤ 95%, C rest
        const sorted = [...current]
            .map((r) => ({ ...r, revenue: num(r.revenue) }))
            .sort((a, b) => b.revenue - a.revenue);
        const totalRevenue = sorted.reduce((sum, r) => sum + r.revenue, 0);
        let cumulative = 0;
        const pareto = sorted.slice(0, 100).map((r) => {
            cumulative += r.revenue;
            const share = totalRevenue ? (cumulative / totalRevenue) * 100 : 0;
            return {
                product_id: r.product_id,
                product_name: r.product_name,
                revenue: round2(r.revenue),
                cumulative_share: round2(share),
                klass: share <= 80 ? 'A' : share <= 95 ? 'B' : 'C',
            };
        });

        return {
            range: { from, to },
            categories: categories.map((c) => ({
                category_id: c.category_id,
                category_name: c.category_name,
                group_name: c.group_name,
                qty_sold: num(c.qty_sold),
                revenue: round2(c.revenue),
                profit: round2(c.profit),
            })),
            gainers,
            decliners,
            pareto,
            products_counted: sorted.length,
        };
    }

    // ─────────────────────── Product History ─────────────────────────────

    static async getProductHistory({
        from, to, page = 0, pageSize = 25,
        productId = null, categoryId = null, groupId = null, search = null,
    }) {
        const { start, endExclusive } = this.#bounds(from, to);
        const limit = Math.min(Math.max(Number(pageSize) || 25, 1), 200);
        const offset = Math.max(Number(page) || 0, 0) * limit;

        let filters = '';
        const params = [start, endExclusive];
        if (productId) { filters += ` AND P.product_id = ?`; params.push(productId); }
        if (categoryId) { filters += ` AND C.category_id = ?`; params.push(categoryId); }
        if (groupId) { filters += ` AND G.group_id = ?`; params.push(groupId); }
        if (search) {
            filters += ` AND (P.product_name LIKE ? OR P.barcode LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }

        const rowsPromise = pool.query(
            `SELECT SOI.order_item_id, P.product_name, C.category_name,
                COALESCE(G.group_name, 'Unclassified') AS group_name,
                SOI.quantity, SOI.unit_price, ${this.#NET} AS line_total,
                ${this.#LINE_PROFIT} AS line_profit,
                O.order_datetime, O.invoice_number, O.discount
             ${this.#ITEM_JOINS} ${this.#ITEM_WHERE} ${filters}
             ORDER BY O.order_datetime DESC
             LIMIT ${limit} OFFSET ${offset}`,
            params,
        );
        const summaryPromise = pool.query(
            `SELECT COUNT(*) AS total,
                COALESCE(SUM(SOI.quantity), 0) AS total_qty,
                COALESCE(SUM(${this.#NET}), 0) AS total_revenue,
                COALESCE(SUM(${this.#LINE_PROFIT}), 0) AS total_profit
             ${this.#ITEM_JOINS} ${this.#ITEM_WHERE} ${filters}`,
            params,
        );

        const [[rows], [[summary]]] = await Promise.all([
            rowsPromise, summaryPromise,
        ]);

        return {
            range: { from, to },
            total: num(summary.total),
            totals: {
                qty: num(summary.total_qty),
                revenue: round2(summary.total_revenue),
                profit: round2(summary.total_profit),
            },
            rows: rows.map((r) => ({
                order_item_id: r.order_item_id,
                product_name: r.product_name,
                category_name: r.category_name ?? '—',
                group_name: r.group_name,
                quantity: num(r.quantity),
                unit_price: round2(r.unit_price),
                line_total: round2(r.line_total),
                line_profit: round2(r.line_profit),
                order_datetime: r.order_datetime,
                invoice_number: r.invoice_number,
                discount: num(r.discount),
            })),
        };
    }

    // ─────────────────────────── Extras ──────────────────────────────────

    static async getDiscounts({ from, to }) {
        const { start, endExclusive, days } = this.#bounds(from, to);
        const granularity = this.#granularity(days);
        const p = [start, endExclusive];

        const summaryPromise = pool.query(
            `SELECT
                COALESCE(SUM(subtotal_amount - total_amount), 0) AS discounts_given,
                COUNT(*) AS orders_count,
                SUM(CASE WHEN discount > 0 THEN 1 ELSE 0 END) AS discounted_count,
                COALESCE(AVG(CASE WHEN discount > 0 THEN discount END), 0) AS avg_discount_pct
             FROM sales_orders
             WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0`,
            p,
        );
        const topPromise = pool.query(
            `SELECT O.order_id, O.invoice_number, O.order_datetime, O.discount,
                O.subtotal_amount, O.total_amount,
                (O.subtotal_amount - O.total_amount) AS discount_value,
                A.name AS customer_name
             FROM sales_orders O
             LEFT JOIN accounts A ON O.customer_id = A.account_id
             WHERE O.order_datetime >= ? AND O.order_datetime < ?
                AND O.is_deleted = 0 AND O.discount > 0
             ORDER BY discount_value DESC LIMIT 10`,
            p,
        );
        const bucket = this.#bucketExpr(granularity, 'order_datetime');
        const trendPromise = pool.query(
            `SELECT ${bucket} AS bucket,
                COALESCE(SUM(subtotal_amount - total_amount), 0) AS discounts
             FROM sales_orders
             WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0
             GROUP BY bucket ORDER BY bucket`,
            p,
        );

        const [[[summary]], [top], [trend]] = await Promise.all([
            summaryPromise, topPromise, trendPromise,
        ]);

        return {
            range: { from, to },
            granularity,
            summary: {
                discounts_given: round2(summary.discounts_given),
                orders_count: num(summary.orders_count),
                discounted_count: num(summary.discounted_count),
                discounted_share: num(summary.orders_count)
                    ? round2((num(summary.discounted_count) / num(summary.orders_count)) * 100)
                    : 0,
                avg_discount_pct: round2(summary.avg_discount_pct),
            },
            top_discounted: top.map((r) => ({
                order_id: r.order_id,
                invoice_number: r.invoice_number,
                order_datetime: r.order_datetime,
                discount: num(r.discount),
                subtotal_amount: round2(r.subtotal_amount),
                total_amount: round2(r.total_amount),
                discount_value: round2(r.discount_value),
                customer_name: r.customer_name ?? null,
            })),
            trend: trend.map((r) => ({
                bucket: r.bucket,
                discounts: round2(r.discounts),
            })),
        };
    }

    static async getHeatmap({ from, to }) {
        const { start, endExclusive } = this.#bounds(from, to);
        // WEEKDAY(): 0 = Monday … 6 = Sunday
        const [rows] = await pool.query(
            `SELECT WEEKDAY(order_datetime) AS dow, HOUR(order_datetime) AS hour,
                COUNT(*) AS orders_count,
                COALESCE(SUM(total_amount), 0) AS revenue
             FROM sales_orders
             WHERE order_datetime >= ? AND order_datetime < ? AND is_deleted = 0
             GROUP BY dow, hour`,
            [start, endExclusive],
        );
        return {
            range: { from, to },
            cells: rows.map((r) => ({
                dow: num(r.dow),
                hour: num(r.hour),
                orders_count: num(r.orders_count),
                revenue: round2(r.revenue),
            })),
        };
    }

    static async getInventory({ moversDays = 30, deadDays = 90 } = {}) {
        const moversStart = moment()
            .subtract(Number(moversDays) || 30, 'days')
            .format('YYYY-MM-DD HH:mm:ss');
        const deadCutoff = moment()
            .subtract(Number(deadDays) || 90, 'days')
            .format('YYYY-MM-DD HH:mm:ss');

        // Stock on hand = signed sum of inventory movements (SALEs are already
        // negative). Same convention as the legacy stock-value report.
        const stockCte = `
            SELECT product_id_fk, SUM(quantity) AS qty
            FROM inventory_transactions
            GROUP BY product_id_fk`;

        const lowPromise = pool.query(
            `SELECT P.product_id, P.product_name, P.barcode, C.category_name,
                COALESCE(S.qty, 0) AS qty, P.low_stock_threshold
             FROM products P
             LEFT JOIN (${stockCte}) S ON S.product_id_fk = P.product_id
             LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
             WHERE P.is_deleted = 0 AND P.stock_management = 1
                AND COALESCE(P.low_stock_threshold, 0) > 0
                AND COALESCE(S.qty, 0) <= P.low_stock_threshold
             ORDER BY COALESCE(S.qty, 0) ASC
             LIMIT 50`,
        );
        const deadPromise = pool.query(
            `SELECT P.product_id, P.product_name, P.barcode, C.category_name,
                COALESCE(S.qty, 0) AS qty, L.last_sale
             FROM products P
             LEFT JOIN (${stockCte}) S ON S.product_id_fk = P.product_id
             LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
             LEFT JOIN (
                SELECT SOI.product_id, MAX(O.order_datetime) AS last_sale
                FROM sales_order_items SOI
                INNER JOIN sales_orders O ON O.order_id = SOI.order_id
                WHERE O.is_deleted = 0
                GROUP BY SOI.product_id
             ) L ON L.product_id = P.product_id
             WHERE P.is_deleted = 0 AND P.stock_management = 1
                AND COALESCE(S.qty, 0) > 0
                AND (L.last_sale IS NULL OR L.last_sale < ?)
             ORDER BY COALESCE(S.qty, 0) DESC
             LIMIT 50`,
            [deadCutoff],
        );
        const fastPromise = pool.query(
            `SELECT P.product_id, P.product_name, P.barcode, C.category_name,
                COALESCE(SUM(SOI.quantity), 0) AS qty_sold,
                COALESCE(SUM(${this.#NET}), 0) AS revenue,
                P.stock_management AS stock_managed,
                COALESCE(S.qty, 0) AS stock_qty
             ${this.#ITEM_JOINS}
             LEFT JOIN (${stockCte}) S ON S.product_id_fk = P.product_id
             WHERE O.order_datetime >= ? AND O.is_deleted = 0
                AND IFNULL(SOI.is_deleted, 0) = 0
             GROUP BY P.product_id
             ORDER BY qty_sold DESC
             LIMIT 20`,
            [moversStart],
        );

        // Stock value — cost at weighted avg (avg_cost_usd, falling back to the
        // product's unit_cost_usd), retail at unit_price_usd. Only products with
        // a positive on-hand quantity contribute: negative stock is a data
        // artifact and must not subtract value or units.
        const stockValuePromise = pool.query(
            `SELECT
                COUNT(*) AS sku_count,
                COALESCE(SUM(S.qty), 0) AS total_units,
                COALESCE(SUM(S.qty * COALESCE(P.avg_cost_usd, P.unit_cost_usd, 0)), 0) AS cost_value,
                COALESCE(SUM(S.qty * COALESCE(P.unit_price_usd, 0)), 0) AS retail_value
             FROM products P
             INNER JOIN (${stockCte}) S ON S.product_id_fk = P.product_id
             WHERE P.is_deleted = 0 AND S.qty > 0`,
        );

        const [[low], [dead], [fast], [[stockValue]]] = await Promise.all([
            lowPromise, deadPromise, fastPromise, stockValuePromise,
        ]);

        const shape = (rows) =>
            rows.map((r) => ({
                ...r,
                qty: num(r.qty),
                qty_sold: r.qty_sold !== undefined ? num(r.qty_sold) : undefined,
                stock_managed:
                    r.stock_managed !== undefined ? !!r.stock_managed : undefined,
                stock_qty: r.stock_qty !== undefined ? num(r.stock_qty) : undefined,
                revenue: r.revenue !== undefined ? round2(r.revenue) : undefined,
                category_name: r.category_name ?? '—',
            }));

        return {
            movers_days: Number(moversDays) || 30,
            dead_days: Number(deadDays) || 90,
            stock_value: {
                sku_count: num(stockValue.sku_count),
                total_units: num(stockValue.total_units),
                cost_value: round2(stockValue.cost_value),
                retail_value: round2(stockValue.retail_value),
            },
            low_stock: shape(low),
            dead_stock: shape(dead),
            fast_movers: shape(fast),
        };
    }
}

module.exports = ReportsV2Model;
