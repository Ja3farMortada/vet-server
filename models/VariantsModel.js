const pool = require("../config/database");

class Variant {
	// create variant
	static async create(data) {
		delete data.variant_id;
		const query = `INSERT INTO products_variants SET ?`;
		await pool.query(query, data);
	}

	// update variant
	static async update(variant) {
		const query = `UPDATE products_variants SET ? WHERE variant_id = ?`;
		await pool.query(query, [variant, variant.variant_id]);
	}

	// delete variant
	static async delete(id) {
		const query = `UPDATE products_variants SET is_deleted = 1 WHERE variant_id = ?`;
		await pool.query(query, id);

		let [[product_id_fk]] = await pool.query(
			`SELECT product_id_fk FROM products_variants WHERE variant_id = ?`,
			id
		);
		return product_id_fk;
	}
}

module.exports = Variant;
