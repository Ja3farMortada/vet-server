const pool = require("../config/database");
const moment = require("moment");

class ReportModel {
    // get revenue
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

    // get revenue by group
    static async getGroupedRevenue(startDate, endDate) {
        const query = `WITH shop_sales AS (
            SELECT SUM(total_price) AS shop_sales FROM sales_order_items SOI 
				INNER JOIN sales_orders O ON SOI.order_id = O.order_id
				INNER JOIN products P ON SOI.product_id = P.product_id
				INNER JOIN products_categories C ON P.category_id_fk = C.category_id
				INNER JOIN category_groups G ON C.group_id_fk = G.group_id
				WHERE DATE(O.order_datetime) BETWEEN ? AND ?
				AND G.group_id = 1
				AND SOI.is_deleted = 0
        	),
        	medical_sales AS (
            SELECT SUM(total_price) AS medical_sales FROM sales_order_items SOI 
				INNER JOIN sales_orders O ON SOI.order_id = O.order_id
				INNER JOIN products P ON SOI.product_id = P.product_id
				INNER JOIN products_categories C ON P.category_id_fk = C.category_id
				INNER JOIN category_groups G ON C.group_id_fk = G.group_id
				WHERE DATE(O.order_datetime) BETWEEN ? AND ?
				AND G.group_id = 2
				AND SOI.is_deleted = 0
        	)
			SELECT
				shop_sales, medical_sales
			FROM
				shop_sales
				CROSS JOIN medical_sales;`;

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
        // let query = `SELECT
        // SUM(debit) AS totalExpenses
        // FROM journal_items
        // WHERE DATE(journal_date) >= ?
        // AND DATE(journal_date) <= ?
        // AND account_id_fk = 8 AND is_deleted = 0;`;
        const query = `SELECT SUM(total_value) AS totalExpenses FROM journal_vouchers WHERE journal_number LIKE 'EXP%' AND is_deleted = 0 AND DATE(journal_date) BETWEEN ? AND ?`;

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
    static async getProductHistory(startDate, endDate, id, searchBy) {
        console.log("called");

        console.log(startDate);
        console.log(endDate);

        // moment.tz.setDefault("Asia/Beirut");
        startDate = moment(startDate).format(`YYYY-MM-DD HH:mm:ss`);
        endDate = moment(endDate).format(`YYYY-MM-DD 23:59:59`);

        console.log(startDate);
        console.log(endDate);
        let query = `
		SELECT
			p.product_name,
			c.category_name,
			g.group_name,
			soi.quantity,
			soi.unit_cost,
			soi.unit_price,
			so.order_datetime,
			so.invoice_number
			FROM sales_order_items soi
			INNER JOIN products p on p.product_id = soi.product_id
			LEFT JOIN products_categories c ON p.category_id_fk = c.category_id
			LEFT JOIN category_groups g ON c.group_id_fk = g.group_id
			INNER JOIN sales_orders so ON so.order_id = soi.order_id 
		WHERE `;

        let queryKey = ``;
        switch (searchBy) {
            case "product":
                queryKey = `p.product_id = ? `;
                break;
            case "category":
                queryKey = `c.category_id = ? `;
                break;
            case "group":
                queryKey = `g.group_id = ? `;
                break;
        }

        query += queryKey;

        query += `AND soi.is_deleted = 0 
		AND so.is_deleted = 0
		AND DATE(so.order_datetime) BETWEEN ? AND ?
		ORDER BY so.order_datetime DESC`;

        let [results] = await pool.query(query, [id, startDate, endDate]);
        return results;
    }
}

module.exports = ReportModel;
