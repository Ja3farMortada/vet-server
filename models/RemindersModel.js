const pool = require("../config/database");
const moment = require("moment-timezone");

class Reminder {
	static async getAll() {
		const query = `SELECT
		R.*,
		P.pet_name,
		P.customer_id_fk,
		A.name,
		A.phone
		FROM reminders R
		LEFT JOIN pets P ON R.pet_id_fk = P.pet_id
		LEFT JOIN accounts A ON P.customer_id_fk = A.account_id
		WHERE R.is_deleted = 0
		ORDER BY R.due_date ASC`;
		const [results] = await pool.query(query);
		return results;
	}

	static async getById(id) {
		const query = `SELECT
		R.*,
		P.pet_name,
		P.customer_id_fk,
		A.name,
		A.phone
		FROM reminders R
		LEFT JOIN pets P ON R.pet_id_fk = P.pet_id
		LEFT JOIN accounts A ON P.customer_id_fk = A.account_id
		WHERE R.reminder_id = ?`;
		const [[results]] = await pool.query(query, id);
		return results;
	}

	static async create(data) {
		// fix date format
		moment.tz.setDefault("Asia/Beirut");
		data.due_date = moment(data.due_date).format(`YYYY-MM-DD`);

		const query = `INSERT INTO reminders SET ?`;
		await pool.query(query, data);
	}

	static async update(data) {
		// fix date format
		moment.tz.setDefault("Asia/Beirut");
		data.due_date = moment(data.due_date).format(`YYYY-MM-DD`);

		const query = `UPDATE reminders SET ? WHERE reminder_id = ?`;
		await pool.query(query, [data, data.reminder_id]);
	}

	static async delete(id) {
		const query = `DELETE FROM reminders WHERE reminder_id = ?`;
		await pool.query(query, id);
	}

	static async markNotified(id) {
		const query = `UPDATE reminders SET has_notified = !has_notified WHERE reminder_id = ?`;
		await pool.query(query, id);
	}

	static async markCompleted(data) {
		const id = data.reminder_id;
		const query = `UPDATE reminders SET due_date = DATE_ADD(due_date, INTERVAL ${data.repeat_after} DAY) WHERE reminder_id = ?`;
		await pool.query(query, id);
	}
}

module.exports = Reminder;
