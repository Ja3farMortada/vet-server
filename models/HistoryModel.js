const pool = require("../config/database");
const moment = require("moment");

class History {
	// fetch sales invoices
	static async fetchSalesHistory(criteria) {
		let sql = `SELECT
            A.name AS customer_name,
            A.phone AS customer_phone,
            A.address AS customer_address,
            A.financial_number,
            O.*,
            O.order_datetime AS order_date,
            JSON_ARRAYAGG(JSON_OBJECT('order_item_id', M.order_item_id, 'product_id', M.product_id, 'product_name', S.product_name, 'variant_id', M.variant_id, 'expiry_date', V.expiry_date, 'barcode', S.barcode, 'quantity', M.quantity, 'price_type', M.price_type, 'original_price', M.original_price, 'discount_percentage', M.discount_percentage, 'unit_cost', M.unit_cost, 'unit_price', M.unit_price, 'total_price', M.total_price)) items
            FROM sales_orders O
            INNER JOIN sales_order_items M ON O.order_id = M.order_id
            INNER JOIN products S ON S.product_id = M.product_id
			LEFT JOIN products_variants V ON M.variant_id = V.variant_id
            LEFT JOIN accounts  A ON O.customer_id = A.account_id
            WHERE O.is_deleted = 0`;
		const params = [];
		if (criteria.invoice_number) {
			sql += ` AND O.invoice_number LIKE ?`;
			params.push(`%${criteria.invoice_number}`);
		}
		if (criteria.customer_id) {
			sql += ` AND O.customer_id = ?`;
			params.push(criteria.customer_id);
		}
		if (criteria.invoice_date) {
			sql += ` AND DATE(order_datetime) = ?`;
			params.push(moment(criteria.invoice_date).format("yyyy-MM-DD"));
		}

		sql += ` GROUP BY O.order_id
        ORDER BY order_date DESC, O.invoice_number DESC
        LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 100);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}

	// fetch sales invoices
	static async fetchDeletedHistory(criteria) {
		let sql = `SELECT
            A.name AS customer_name,
            A.phone AS customer_phone,
            A.address AS customer_address,
            A.financial_number,
            O.*,
            O.order_datetime AS order_date,
            JSON_ARRAYAGG(JSON_OBJECT('order_item_id', M.order_item_id, 'product_id', M.product_id, 'product_name', S.product_name, 'variant_id', M.variant_id, 'expiry_date', V.expiry_date, 'barcode', S.barcode, 'quantity', M.quantity, 'price_type', M.price_type, 'original_price', M.original_price, 'discount_percentage', M.discount_percentage, 'unit_cost', M.unit_cost, 'unit_price', M.unit_price, 'total_price', M.total_price)) items
            FROM sales_orders O
            INNER JOIN sales_order_items M ON O.order_id = M.order_id
            INNER JOIN products S ON S.product_id = M.product_id
			LEFT JOIN products_variants V ON M.variant_id = V.variant_id
            LEFT JOIN accounts  A ON O.customer_id = A.account_id
            WHERE O.is_deleted = 1`;
		const params = [];
		if (criteria.invoice_number) {
			sql += ` AND O.invoice_number LIKE ?`;
			params.push(`%${criteria.invoice_number}`);
		}
		if (criteria.customer_id) {
			sql += ` AND O.customer_id = ?`;
			params.push(criteria.customer_id);
		}
		if (criteria.invoice_date) {
			sql += ` AND DATE(order_datetime) = ?`;
			params.push(moment(criteria.invoice_date).format("yyyy-MM-DD"));
		}

		sql += ` GROUP BY O.order_id
        ORDER BY order_date DESC, O.invoice_number DESC
        LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 100);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}

	//fetch payment history
	static async fetchPaymentHistory(criteria) {
		let sql = `SELECT
				A.name AS partner_name,
				A.phone AS partner_phone,
				A.address AS partner_address,
				A.account_id AS partner_id,
				P.*,
				P.journal_date AS payment_date
                FROM journal_vouchers P
                INNER JOIN journal_items I ON P.journal_id = I.journal_id_fk
                INNER JOIN accounts A ON I.partner_id_fk = A.account_id
                WHERE P.is_deleted = 0 AND journal_description = 'Payment' OR journal_description = 'Payment Received'`;
		const params = [];
		if (criteria.payment_number) {
			sql += ` AND P.journal_number = ?`;
			params.push(criteria.payment_number);
		}
		if (criteria.partner_id) {
			sql += ` AND I.partner_id_fk = ?`;
			params.push(criteria.partner_id);
		}
		if (criteria.payment_date) {
			sql += ` AND DATE(P.journal_date) = ?`;
			params.push(moment(criteria.payment_date).format("yyyy-MM-DD"));
		}

		sql += ` ORDER BY payment_date DESC, P.journal_number DESC
		LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 100);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}

	//fetch return history
	static async fetchReturnHistory(criteria) {
		let sql = `SELECT
                A.name AS customer_name,
                A.phone AS customer_phone,
                A.address AS customer_address,
                A.financial_number,
                RO.*,
                DATE(RO.order_datetime) AS order_date,
                JSON_ARRAYAGG(JSON_OBJECT('order_item_id', M.order_item_id, 'product_id', M.product_id, 'product_name', S.product_name, 'quantity', M.quantity, 'price_type', M.price_type,'unit_cost', M.unit_cost, 'unit_price', M.unit_price, 'total_price', M.total_price)) items
            FROM return_orders RO
            INNER JOIN return_order_items M ON RO.order_id = M.order_id
            INNER JOIN products S ON S.product_id = M.product_id
            INNER JOIN accounts  A ON RO.customer_id = A.account_id
            WHERE RO.is_deleted = 0 `;
		const params = [];
		if (criteria.invoice_number) {
			sql += ` AND RO.invoice_number = ?`;
			params.push(criteria.invoice_number);
		}
		if (criteria.customer_id) {
			sql += ` AND RO.customer_id = ?`;
			params.push(criteria.customer_id);
		}
		if (criteria.invoice_date) {
			sql += ` AND DATE(order_datetime) = ?`;
			params.push(moment(criteria.invoice_date).format("yyyy-MM-DD"));
		}

		sql += ` GROUP BY RO.order_id
        ORDER BY order_date DESC, RO.invoice_number DESC
        LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 100);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}

	//fetch purchase history
	static async fetchPurchaseHistory(criteria) {
		let sql = `SELECT
            A.name AS supplier_name,
            A.phone AS supplier_phone,
            A.address AS supplier_address,
            A.financial_number,
            PO.*,
            DATE(PO.order_datetime) AS order_date,
            JSON_ARRAYAGG(JSON_OBJECT('order_item_id', M.order_item_id, 'product_id', M.product_id_fk, 'product_name', S.product_name, 'variant_id', M.variant_id, 'expiry_date', V.expiry_date, 'barcode', S.barcode , 'quantity', M.quantity, 'unit_cost', M.unit_cost_usd, 'unit_price', M.unit_cost_usd )) items
            FROM purchase_orders PO
            INNER JOIN purchase_order_items M ON PO.order_id = M.order_id_fk
            INNER JOIN products S ON S.product_id = M.product_id_fk
            INNER JOIN accounts  A ON PO.partner_id_fk  = A.account_id
			LEFT JOIN products_variants V ON M.variant_id = V.variant_id
            WHERE PO.is_deleted = 0`;
		const params = [];
		if (criteria.invoice_number) {
			sql += ` AND PO.invoice_number = ?`;
			params.push(criteria.invoice_number);
		}
		if (criteria.supplier_id) {
			sql += ` AND PO.partner_id_fk = ?`;
			params.push(criteria.supplier_id);
		}
		if (criteria.invoice_date) {
			sql += ` AND DATE(order_datetime) = ?`;
			params.push(moment(criteria.invoice_date).format("yyyy-MM-DD"));
		}

		sql += ` GROUP BY PO.order_id
        ORDER BY order_date DESC, PO.invoice_number DESC
        LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 100);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}

	//fetch receipts history
	static async fetchReceiptHistory(criteria) {
		let sql = `SELECT
				A.name AS partner_name,
				A.phone AS partner_phone,
				A.address AS partner_address,
				A.account_id AS partner_id,
				P.*,
				P.journal_date AS payment_date
                FROM journal_vouchers P
                INNER JOIN journal_items I ON P.journal_id = I.journal_id_fk
                INNER JOIN accounts A ON I.partner_id_fk = A.account_id
                WHERE P.is_deleted = 0 AND journal_description = 'Supplier Payment'`;
		const params = [];
		if (criteria.payment_number) {
			sql += ` AND P.journal_number = ?`;
			params.push(criteria.payment_number);
		}
		if (criteria.partner_id) {
			sql += ` AND I.partner_id_fk = ?`;
			params.push(criteria.partner_id);
		}
		if (criteria.payment_date) {
			sql += ` AND DATE(P.journal_date) = ?`;
			params.push(moment(criteria.payment_date).format("yyyy-MM-DD"));
		}

		sql += ` ORDER BY payment_date DESC, P.journal_number DESC
		LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 100);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}
}

module.exports = History;
