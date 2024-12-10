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
}

module.exports = ReportModel;
