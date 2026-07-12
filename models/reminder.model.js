const pool = require("../config/database");
const moment = require("moment-timezone");

// MySQL stores TINYINT(1) for boolean columns, which mysql2 returns as 0/1.
// Normalize the flag columns to real booleans before sending to the client.
const BOOL_FIELDS = ["is_notified", "is_completed", "is_repeated", "is_booked"];

const toBool = (v) => v === 1 || v === true || v === "1";

const normalize = (row) => {
	if (!row) return row;
	const out = { ...row };
	for (const f of BOOL_FIELDS) {
		if (f in out) out[f] = toBool(out[f]);
	}
	return out;
};

const normalizeMany = (rows) => (Array.isArray(rows) ? rows.map(normalize) : rows);

class Reminder {
	// get all reminders (joined with pet + account info)
	static async getAll() {
		const query = `SELECT
			R.*,
			P.pet_name,
			A.name AS account_name,
			A.phone AS account_phone
		FROM reminders R
		LEFT JOIN pets P ON R.pet_id = P.pet_id
		LEFT JOIN accounts A ON R.account_id = A.account_id
		ORDER BY R.due_date ASC`;
		const [results] = await pool.query(query);
		return normalizeMany(results);
	}

	// get reminder by id
	static async getById(id) {
		const query = `SELECT
			R.*,
			P.pet_name,
			A.name AS account_name,
			A.phone AS account_phone
		FROM reminders R
		LEFT JOIN pets P ON R.pet_id = P.pet_id
		LEFT JOIN accounts A ON R.account_id = A.account_id
		WHERE R.reminder_id = ?`;
		const [[result]] = await pool.query(query, [id]);
		return normalize(result);
	}

	// create reminder
	static async create(data) {
		moment.tz.setDefault("Asia/Beirut");
		data.due_date = moment(data.due_date).format("YYYY-MM-DD");

		const query = `INSERT INTO reminders SET ?`;
		const [result] = await pool.query(query, data);
		return result.insertId;
	}

	// update reminder
	static async update(id, data) {
		if (data.due_date) {
			moment.tz.setDefault("Asia/Beirut");
			data.due_date = moment(data.due_date).format("YYYY-MM-DD");
		}

		const query = `UPDATE reminders SET ? WHERE reminder_id = ?`;
		const [result] = await pool.query(query, [data, id]);
		return result.affectedRows;
	}

	// delete reminder
	static async delete(id) {
		const query = `DELETE FROM reminders WHERE reminder_id = ?`;
		const [result] = await pool.query(query, [id]);
		return result.affectedRows;
	}

	// upcoming reminders within `days` window (default 7).
	// Excludes completed reminders — a completed item is not actionable
	// from the user's perspective, so showing it in "upcoming" is noise.
	static async getUpcoming(days = 7) {
		const query = `SELECT
			R.*,
			P.pet_name,
			A.name AS account_name,
			A.phone AS account_phone
		FROM reminders R
		LEFT JOIN pets P ON R.pet_id = P.pet_id
		LEFT JOIN accounts A ON R.account_id = A.account_id
		WHERE R.is_completed = 0
		AND R.due_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
		ORDER BY R.due_date ASC`;
		const [results] = await pool.query(query, [days]);
		return normalizeMany(results);
	}

	// get reminders by pet
	static async getByPetId(pet_id) {
		const query = `SELECT * FROM reminders WHERE pet_id = ? ORDER BY due_date ASC`;
		const [results] = await pool.query(query, [pet_id]);
		return normalizeMany(results);
	}

	// get reminders by account
	static async getByAccountId(account_id) {
		const query = `SELECT * FROM reminders WHERE account_id = ? ORDER BY due_date ASC`;
		const [results] = await pool.query(query, [account_id]);
		return normalizeMany(results);
	}

	// mark as notified
	static async markNotified(id) {
		const query = `UPDATE reminders SET is_notified = 1 WHERE reminder_id = ?`;
		const [result] = await pool.query(query, [id]);
		return result.affectedRows;
	}

	// mark as completed.
	// If the reminder is repeated, we DO NOT create a new row — we roll the
	// same record forward: push due_date by repeat_after_days and reset
	// is_completed / is_notified so the next cycle behaves like a fresh one.
	static async markCompleted(id) {
		const [[reminder]] = await pool.query(
			`SELECT reminder_id, is_repeated, repeat_after_days FROM reminders WHERE reminder_id = ?`,
			[id]
		);
		if (!reminder) return 0;

		let query;
		if (reminder.is_repeated && reminder.repeat_after_days) {
			query = `UPDATE reminders
				SET due_date = DATE_ADD(due_date, INTERVAL ? DAY),
					is_completed = 0,
					is_notified = 0
				WHERE reminder_id = ?`;
			const [result] = await pool.query(query, [
				reminder.repeat_after_days,
				id,
			]);
			return result.affectedRows;
		}

		query = `UPDATE reminders SET is_completed = 1 WHERE reminder_id = ?`;
		const [result] = await pool.query(query, [id]);
		return result.affectedRows;
	}

	// mark as booked
	static async markBooked(id) {
		const query = `UPDATE reminders SET is_booked = 1 WHERE reminder_id = ?`;
		const [result] = await pool.query(query, [id]);
		return result.affectedRows;
	}
}

module.exports = Reminder;
