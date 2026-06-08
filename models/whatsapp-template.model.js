/*
CREATE TABLE whatsapp_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message_template TEXT NOT NULL,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
*/

const pool = require("../config/database");

// MySQL stores TINYINT(1) for is_active, which mysql2 returns as 0/1.
// Normalize to a real boolean before sending to the client.
const normalize = (row) => {
	if (!row) return row;
	return { ...row, is_active: row.is_active === 1 || row.is_active === true };
};

const normalizeMany = (rows) => (Array.isArray(rows) ? rows.map(normalize) : rows);

class WhatsappTemplate {
	// get all templates, ordered by name; optionally only active ones
	static async getAll(activeOnly = false) {
		const query = activeOnly
			? "SELECT * FROM whatsapp_templates WHERE is_active = 1 ORDER BY name ASC"
			: "SELECT * FROM whatsapp_templates ORDER BY name ASC";
		const [results] = await pool.query(query);
		return normalizeMany(results);
	}

	// get template by id
	static async getById(id) {
		const [[result]] = await pool.query(
			"SELECT * FROM whatsapp_templates WHERE id = ?",
			[id]
		);
		return normalize(result);
	}

	// create template
	static async create(templateData) {
		const [result] = await pool.query(
			"INSERT INTO whatsapp_templates SET ?",
			templateData
		);
		return result.insertId;
	}

	// update template
	static async update(id, templateData) {
		const [result] = await pool.query(
			"UPDATE whatsapp_templates SET ? WHERE id = ?",
			[templateData, id]
		);
		return result.affectedRows;
	}

	// delete template
	static async delete(id) {
		const [result] = await pool.query(
			"DELETE FROM whatsapp_templates WHERE id = ?",
			[id]
		);
		return result.affectedRows;
	}
}

module.exports = WhatsappTemplate;
