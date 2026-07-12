/*
CREATE TABLE whatsapp_templates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    message_template TEXT NOT NULL,
    location ENUM('reminders','reservations','sell','payment') NOT NULL DEFAULT 'reminders',
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Multiple templates per location are allowed (each screen shows a picker of
-- its own location's active templates), so `location` is NOT unique.
*/

const pool = require("../config/database");

// MySQL stores TINYINT(1) for is_active, which mysql2 returns as 0/1.
// Normalize to a real boolean before sending to the client.
const normalize = (row) => {
    if (!row) return row;
    return { ...row, is_active: row.is_active === 1 || row.is_active === true };
};

const normalizeMany = (rows) =>
    Array.isArray(rows) ? rows.map(normalize) : rows;

class WhatsappTemplate {
    // get all templates, ordered by name; optionally filtered by active flag
    // and/or assigned location
    static async getAll(activeOnly = false, location = null) {
        const conditions = [];
        const params = [];
        if (activeOnly) {
            conditions.push("is_active = 1");
        }
        if (location) {
            conditions.push("location = ?");
            params.push(location);
        }
        const where = conditions.length
            ? `WHERE ${conditions.join(" AND ")}`
            : "";
        const [results] = await pool.query(
            `SELECT * FROM whatsapp_templates ${where} ORDER BY name ASC`,
            params,
        );
        return normalizeMany(results);
    }

    // get template by id
    static async getById(id) {
        const [[result]] = await pool.query(
            "SELECT * FROM whatsapp_templates WHERE id = ?",
            [id],
        );
        return normalize(result);
    }

    // create template
    static async create(templateData) {
        const [result] = await pool.query(
            "INSERT INTO whatsapp_templates SET ?",
            templateData,
        );
        return result.insertId;
    }

    // update template
    static async update(id, templateData) {
        const [result] = await pool.query(
            "UPDATE whatsapp_templates SET ? WHERE id = ?",
            [templateData, id],
        );
        return result.affectedRows;
    }

    // delete template
    static async delete(id) {
        const [result] = await pool.query(
            "DELETE FROM whatsapp_templates WHERE id = ?",
            [id],
        );
        return result.affectedRows;
    }
}

module.exports = WhatsappTemplate;
