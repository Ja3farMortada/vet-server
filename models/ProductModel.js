const pool = require("../config/database");

class Product {
	// get all products
	static async getAll() {
		const query = `SELECT
            C.category_name,
            P.*,


            IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'SUPPLY'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'RETURN'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DELETE'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'ADD'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'REMOVE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'SALE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DISPOSE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DELIVER'), 0)

			AS quantity
            FROM products P
            LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
    
            WHERE P.is_deleted = 0

            ORDER BY P.product_id ASC`;

		const [result] = await pool.query(query);
		return result;
	}

	// get by category_id
	static async getByCategory(category_id) {
		const [rows] = await pool.query(
			`SELECT
		    C.category_name,
		    P.*
		    FROM products P
		    LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
		    WHERE C.category_id = ?
		    AND P.is_deleted = 0`,
			[category_id]
		);
		return rows;
	}

	// get by product_id
	static async getById(product_id) {
		const [rows] = await pool.query(
			`SELECT
            C.category_name,
            P.*,


            IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'SUPPLY'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'RETURN'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'ADD'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DELETE'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'REMOVE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'SALE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DISPOSE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DELIVER'), 0)


			AS quantity
            FROM products P
            LEFT JOIN products_categories C ON P.category_id_fk = C.category_id
            WHERE P.product_id = ?
            AND P.is_deleted = 0`,
			[product_id]
		);
		return rows;
	}

	static async getByBarcode(barcode) {
		const [rows] = await pool.query(
			`SELECT
            C.category_name,
            P.*,


            IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'SUPPLY'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'RETURN'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'ADD'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DELETE'), 0)

            + IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'REMOVE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'SALE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DISPOSE'), 0)

			+ IFNULL((SELECT SUM(quantity) FROM inventory_transactions WHERE product_id_fk = P.product_id AND transaction_type = 'DELIVER'), 0)


			AS quantity
            FROM products P
            LEFT JOIN products_categories C ON P.category_id_fk = C.category_id

            WHERE P.barcode = ?
            AND P.is_deleted = 0`,
			[barcode]
		);
		return rows;
	}

	// create new product
	static async create(data) {
		const connection = await pool.getConnection();
		try {
			// begin transaction
			await connection.beginTransaction();

			let product = {
				category_id_fk: data.category_id_fk,
				barcode: data.barcode,
				product_name: data.product_name,
				unit_cost_usd: data.unit_cost_usd,
				unit_price_usd: data.unit_price_usd,
				product_notes: data.product_notes,
				low_stock_threshold: data.low_stock_threshold,
				stock_management: data.stock_management,
			};
			// // insert into product table
			const [rows] = await connection.query(
				`INSERT INTO products SET ?`,
				product
			);

			if (data.stock_management && data.quantity) {
				await connection.query(
					`INSERT INTO inventory_transactions (product_id_fk, quantity, transaction_type, transaction_notes) VALUES (?, ?, 'ADD', 'Initial Quantity');`,
					[rows.insertId, data.quantity]
				);
			}

			// // commit transaction
			await connection.commit();

			return rows;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// update existing product
	static async update(data) {
		const connection = await pool.getConnection();
		try {
			// begin transaction
			await connection.beginTransaction();

			let product = {
				category_id_fk: data.category_id_fk,
				barcode: data.barcode,
				product_name: data.product_name,
				unit_cost_usd: data.unit_cost_usd,
				unit_price_usd: data.unit_price_usd,
				product_notes: data.product_notes,
				stock_management: data.stock_management,
			};

			// update product table
			await connection.query(
				`UPDATE products SET ? WHERE product_id = ?`,
				[product, data.product_id]
			);

			// commit transaction
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// delete product
	static async delete(id) {
		
		const connection = await pool.getConnection();
		try {
			// begin transaction
			await connection.beginTransaction();

			// delete from product table
			await connection.query(
				`UPDATE products SET is_deleted = 1, barcode = NULL WHERE product_id = ?`,
				id
			);

			// delete transactions
			await connection.query(
				`DELETE FROM inventory_transactions WHERE product_id_fk = ?`,
				id
			);

			// commit transaction
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// update stock qty manually
	static async updateStock(data) {
		if (data.transaction_type === "REMOVE") {
			data.quantity = -data.quantity;
		}
		let query = `INSERT INTO inventory_transactions SET ?`;
		await pool.query(query, data);
	}

	static async getHistoryById(id) {
		const query = `SELECT * FROM inventory_transactions WHERE product_id_fk = ? AND is_deleted = 0 ORDER BY transaction_datetime DESC LIMIT 100`;
		let [rows] = await pool.query(query, id);
		return rows;
	}

	// get units of measure
	static async getUnits() {
		const [rows] = await pool.query(
			`SELECT * FROM units_of_measure WHERE is_deleted = 0`
		);
		return rows;
	}
}

module.exports = Product;
