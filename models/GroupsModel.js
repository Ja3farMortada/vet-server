const pool = require("../config/database");

class Group {
	static async getAll() {
		const [rows] = await pool.query(
			`SELECT * FROM category_groups WHERE is_deleted = 0;`
		);
		return rows;
	}
}

module.exports = Group;
