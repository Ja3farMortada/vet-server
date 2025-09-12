const pool = require("../config/database");
const Accounts = require("./AccountsModel");
const moment = require("moment-timezone");

class BalanceModel {
	// get balance
	static async getBalance() {
		const [_531] = await Accounts.getIdByAccountNumber("531");
		const query = `SELECT COALESCE(sum(debit) - sum(credit),0) AS balance
        FROM journal_items ji
        where ji.is_deleted =0
        AND ji.account_id_fk= ?`;
		const [[rows]] = await pool.query(query, [_531.id]);
		return rows;
	}

	// get cash transaction history
	static async getCashTransactions(start, end) {
		const [_531] = await Accounts.getIdByAccountNumber("531");

		const query = `
			WITH partner_balance AS (
				SELECT
					SUM(COALESCE(ji.debit, 0)) AS debit,
					SUM(COALESCE(ji.credit, 0)) AS credit
				FROM journal_items ji
				INNER JOIN journal_vouchers jv ON ji.journal_id_fk = jv.journal_id
				WHERE
					ji.account_id_fk = ?
					AND DATE(jv.journal_date) < ?
					AND ji.is_deleted = 0
					AND jv.is_deleted = 0
			),
			all_entries AS (
				-- Initial Balance
				SELECT
					0 AS ordering,
					NULL AS journal_date,
					NULL AS journal_datetime,
					NULL AS journal_number,
					'Initial Balance' AS journal_description,
					COALESCE(pb.debit, 0) AS debit,
					COALESCE(pb.credit, 0) AS credit,
					NULL AS currency,
					NULL AS exchange_value
				FROM partner_balance pb

				UNION ALL

				-- Journal entries
				SELECT
					1 AS ordering,
					DATE(jv.journal_date) AS journal_date,
					jv.journal_date AS journal_datetime,
					jv.journal_number,
					jv.journal_description,
					COALESCE(ji.debit, 0) AS debit,
					COALESCE(ji.credit, 0) AS credit,
					ji.currency,
					ji.exchange_value
				FROM journal_items ji
				INNER JOIN journal_vouchers jv ON jv.journal_id = ji.journal_id_fk
				WHERE
					ji.account_id_fk = ?
					AND DATE(jv.journal_date) BETWEEN ? AND ?
					AND ji.is_deleted = 0
					AND jv.is_deleted = 0
			)
			SELECT
				journal_date,
				journal_datetime,
				journal_number,
				journal_description,
				debit,
				credit,
				currency,
				exchange_value,
				SUM(debit - credit) OVER (
					ORDER BY ordering, journal_datetime
					ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
				) AS balance
			FROM all_entries
			ORDER BY ordering, journal_datetime;`;

		const [rows] = await pool.query(query, [
			_531.id,
			start,
			_531.id,
			start,
			end,
		]);
		return rows;
	}

	// correct balance manually
	static async correctBalance(data) {
		const connection = await pool.getConnection();

		try {
			await connection.beginTransaction();

			moment.tz.setDefault("Asia/Beirut");
			let date = moment().format(`YYYY-MM-DD HH:mm:ss`);

			// create journal voucher
			let query = `INSERT INTO journal_vouchers (journal_date, journal_description, total_value) VALUES (?, ?, ?)`;
			let [journal_voucher] = await connection.query(query, [
				date,
				data.transaction_notes,
				data.amount,
			]);

			// cash account
			let [_531] = await Accounts.getIdByAccountNumber("531");
			let cashDollar = {
				journal_id_fk: journal_voucher.insertId,
				journal_date: date,
				account_id_fk: _531.id,
				currency: "USD",
				exchange_value: data.exchange_rate,
			};

			// capital account
			let [_101] = await Accounts.getIdByAccountNumber("101");
			let capital = {
				journal_id_fk: journal_voucher.insertId,
				journal_date: date,
				account_id_fk: _101.id,
				currency: "USD",
				exchange_value: data.exchange_rate,
			};

			// check transaction type
			if (data.transaction_type == "ADD") {
				cashDollar.debit = data.amount;
				capital.credit = data.amount;
			} else {
				cashDollar.credit = data.amount;
				capital.debit = data.amount;
			}

			// create journal entries
			await connection.query(
				`INSERT INTO journal_items SET ?`,
				cashDollar
			);
			await connection.query(`INSERT INTO journal_items SET ?`, capital);

			// commit changes
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}
}

module.exports = BalanceModel;
