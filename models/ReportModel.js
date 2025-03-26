const pool = require("../config/database");

class ReportModel {
	static async getRevenue(startDate, endDate) {
		let query = ` WITH sales_summary AS (
            SELECT
                COALESCE(SUM(total_amount), 0) AS totalSale,
                COALESCE(SUM(total_cost), 0) AS totalCost,
                COALESCE(SUM(total_amount - total_cost), 0) AS grossProfit
            FROM
                sales_orders
            WHERE
                DATE(order_datetime) >= ?
                AND DATE(order_datetime) <= ?

                AND is_deleted = 0
        ),
        return_summary AS (
            SELECT
                COALESCE(SUM(total_amount), 0) AS totalReturn,
                COALESCE(SUM(total_cost), 0) AS totalReturnCost,
                COALESCE(SUM(total_amount - total_cost), 0) AS grossReturn
            FROM
                return_orders
            WHERE
                DATE(order_datetime) >= ?
                AND DATE(order_datetime) <= ?

                AND is_deleted = 0
        )
        SELECT
            (sales.totalSale - returns.totalReturn) AS totalSale,
            (sales.totalCost - returns.totalReturnCost) AS totalCost,
            (sales.grossProfit - returns.grossReturn) AS grossProfit
        FROM
            sales_summary sales
            CROSS JOIN return_summary returns;`;
		let [[result]] = await pool.query(query, [
			startDate,
			endDate,

			startDate,
			endDate,
		]);
		return result;
	}

	// get total expenses
	static async getExpenses(startDate, endDate) {
		let query = `SELECT
        SUM(debit) AS totalExpenses
        FROM journal_items
        WHERE DATE(journal_date) >= ?
        AND DATE(journal_date) <= ?
        AND account_id_fk = 8;`;

		let [[results]] = await pool.query(query, [startDate, endDate]);

		return results;
	}

	// get total supplier payments
	static async getSupplierPayments(startDate, endDate) {
		let query = `SELECT
        SUM(total_value) AS totalSupplierPayments
        FROM journal_vouchers
        WHERE DATE(journal_date) >= ?
        AND DATE(journal_date) <= ?
        AND journal_number LIKE 'REC%'
		AND is_deleted = 0`;

		let [[results]] = await pool.query(query, [startDate, endDate]);

		return results;
	}

	// get top sales
	static async getTopSales(startDate, endDate, id) {
		let query = `SELECT p.product_id, p.product_name AS item_name, c.category_name,
                SUM(soi.quantity) AS count FROM sales_order_items soi
                INNER JOIN products p  ON soi.product_id  = p.product_id
				INNER JOIN products_categories c ON p.category_id_fk = c.category_id
                WHERE soi.order_id IN

                (SELECT so.order_id FROM sales_orders so
                    WHERE DATE(so.order_datetime) >= ?
                    AND DATE(so.order_datetime) <= ?
                    AND so.is_deleted = 0)`;

		if (id != "null") {
			query += ` AND p.product_id = ? `;
		}
		query += `GROUP BY p.product_id
                ORDER BY count DESC
                LIMIT 10 `;
		let [results] = await pool.query(query, [startDate, endDate, id]);
		return results;
	}

	static async getTotalPayments(startDate, endDate) {
		let query = `
        SELECT
        COALESCE(sum(total_value), 0) as totalPayment
        FROM journal_vouchers P
        WHERE P.is_deleted = 0
        AND DATE(P.journal_date) BETWEEN ? AND ?

        AND journal_description = 'Payment';`;
		let [[result]] = await pool.query(query, [startDate, endDate]);
		return result;
	}

	static async getTopCategories(startDate, endDate) {
		let query = `SELECT PC.category_name,
        SUM(SOI.quantity) AS count FROM sales_orders SO
        INNER JOIN sales_order_items SOI ON SO.order_id = SOI.order_id
        
        INNER JOIN products P ON P.product_id  = SOI.product_id
        INNER JOIN products_categories PC ON PC.category_id  = P.category_id_fk
        WHERE SO.is_deleted = 0
        AND DATE(SO.order_datetime) >= ?
        AND DATE (SO.order_datetime) <= ?
        GROUP BY PC.category_name
        ORDER BY count DESC
        LIMIT 10
    `;
		let [results] = await pool.query(query, [startDate, endDate]);
		return results;
	}
	// get stock value
	static async getStockValue() {
		const query = `SELECT
            SUM((quantity * unit_cost_usd)) AS cost_value,
            SUM((quantity * unit_price_usd)) AS selling_value,
		    SUM(quantity) AS total_quantity
        	FROM products P

        	LEFT JOIN

            (SELECT
                product_id_fk,
                SUM(CASE WHEN transaction_type = 'SUPPLY' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'RETURN' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'DELETE' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'ADD' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'REMOVE' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'SALE' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'DISPOSE' THEN quantity ELSE 0 END)
                + SUM(CASE WHEN transaction_type = 'DELIVER' THEN quantity ELSE 0 END) AS quantity
            FROM inventory_transactions
            GROUP BY product_id_fk) t ON P.product_id = t.product_id_fk

            WHERE P.is_deleted = 0
            AND t.quantity > 0`;
		let [[result]] = await pool.query(query);

		return result;
	}

	// get product history
	static async getProductHistory(startDate, endDate, id) {
		const query = `
		SELECT
			p.product_name,
			soi.quantity,
			soi.unit_cost,
			soi.unit_price,
			so.order_datetime,
			so.invoice_number
			FROM sales_order_items soi
			INNER JOIN products p on p.product_id = soi.product_id
			INNER JOIN sales_orders so ON so.order_id = soi.order_id 
		WHERE p.product_id = ? 
		AND soi.is_deleted = 0 
		AND so.is_deleted = 0
		AND DATE(so.order_datetime) BETWEEN ? AND ?
		ORDER BY so.order_datetime DESC`;

		let [results] = await pool.query(query, [id, startDate, endDate]);
		return results;
	}
}

module.exports = ReportModel;
