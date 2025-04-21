const pool = require("../config/database");

class Category {
	// get all categories
	static async getAll() {
		const [rows] = await pool.query(
			`SELECT C.*, G.group_id, G.group_name FROM products_categories C
			LEFT JOIN category_groups G ON C.group_id_fk = G.group_id AND G.is_deleted = 0
			WHERE C.is_deleted = 0
			ORDER BY C.category_index ASC`
		);
		return rows;
	}

	// get by id
	static async getById(id) {
		const [[rows]] = await pool.query(
			`SELECT C.*, G.group_id, G.group_name FROM products_categories C
			LEFT JOIN category_groups G ON C.group_id_fk = G.group_id AND G.is_deleted = 0
			WHERE category_id = ?`,
			id
		);
		return rows;
	}

	// sort categories
	static async sort(categories) {
		let query = "";
		categories.forEach((element) => {
			query += `UPDATE products_categories SET category_index = ${categories.indexOf(
				element
			)} WHERE category_id = ${element.category_id};`;
		});
		await pool.query(query);
	}

	// create category
	static async create(category) {
		// create max index for category_index
		const [[{ category_index }]] = await pool.query(
			`SELECT IFNULL(MAX(category_index) + 1, 0) AS category_index FROM products_categories`
		);
		category.category_index = category_index;

		// insert new category
		const [rows] = await pool.query(
			`INSERT INTO products_categories SET ?`,
			category
		);
		return rows;
	}

	// update category
	static async update(category) {
		await pool.query(
			`UPDATE products_categories SET ? WHERE category_id = ?`,
			[category, category.category_id]
		);
	}

	// delete category
	static async delete(id) {
		await pool.query(
			`UPDATE products_categories SET is_deleted = 1 WHERE category_id = ?`,
			id
		);
	}
}

module.exports = Category;
