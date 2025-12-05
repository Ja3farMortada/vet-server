const pool = require("../config/database");
const Accounts = require("../models/AccountsModel");
const moment = require("moment-timezone");

class Expense {
  // get all
  static async getExpenseDetails(criteria) {
    const { expense_category, start_date, end_date } = criteria;

    const [_531] = await Accounts.getIdByAccountNumber("531");
    let query = `SELECT
        jv.journal_id,
        jv.journal_number,
        jv.journal_description,
		jv.journal_notes,
        jv.journal_date as payment_date,
        jv.total_value,
		jv.updated_at,
		jv.update_reason,
        ji.account_id_fk

        FROM journal_vouchers jv

        INNER JOIN journal_items ji ON jv.journal_id = ji.journal_id_fk

        WHERE jv.journal_number LIKE 'EXP%' `;

    const params = [];

    if (expense_category) {
      query += ` AND jv.journal_notes = ?`;
      params.push(expense_category);
    }

    if (start_date) {
      query += ` AND jv.journal_date >= ?`;
      params.push(start_date);
    }

    if (end_date) {
      query += ` AND jv.journal_date <= ?`;
      params.push(end_date);
    }

    query += ` AND ji.is_deleted = 0
		AND jv.is_deleted = 0
        AND ji.account_id_fk != ?
        ORDER BY jv.journal_date DESC`;

    params.push(_531.id);
    const [expenses] = await pool.query(query, params);
    return expenses;
  }

  // get accounts for expenses dropdown
  static async getExpenseAccounts() {
    const accounts = await Accounts.getAccountsByAccountNumber("6112%");
    return accounts;
  }

  // new expense
  static async createExpense(paymentData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      moment.tz.setDefault("Asia/Beirut");
      paymentData.payment_date = moment(paymentData.payment_date).format(
        `YYYY-MM-DD HH:mm:ss`
      );

      let [[{ number }]] = await connection.query(
        `SELECT IFNULL(MAX(CAST(SUBSTRING(journal_number , 4) AS UNSIGNED)), 1000) + 1 AS number FROM journal_vouchers jv where journal_number like 'EXP%'`
      );

      let payment_number = `EXP${number.toString().padStart(4, "0")}`;

      //insert to vouchers and journal_items
      let query = `INSERT INTO journal_vouchers (journal_number, journal_date, journal_description, journal_notes, total_value) VALUES (?, ?, ?, ?, ?)`;
      const [journal_voucher] = await connection.query(query, [
        payment_number,
        paymentData.payment_date,
        paymentData.journal_description,
        paymentData.journal_notes,
        paymentData.amount,
      ]);

      let [_531] = await Accounts.getIdByAccountNumber("531");

      const cashAccount = {
        journal_id_fk: journal_voucher.insertId,
        journal_date: paymentData.payment_date,
        account_id_fk: _531.id,
        reference_number: paymentData.reference_number,
        partner_id_fk: null,
        currency: "USD",
        debit: 0,
        credit: paymentData.amount,
        exchange_value: paymentData.exchange_rate,
      };
      await connection.query(`INSERT INTO journal_items SET ?`, cashAccount);

      let [_6112] = await Accounts.getIdByAccountNumber("6112");

      const secondItem = {
        journal_id_fk: journal_voucher.insertId,
        journal_date: paymentData.payment_date,
        account_id_fk: _6112.id,
        reference_number: paymentData.reference_number,
        partner_id_fk: null,
        currency: "USD",
        debit: paymentData.amount,
        credit: 0,
        exchange_value: paymentData.exchange_rate,
      };
      await connection.query(`INSERT INTO journal_items SET ?`, secondItem);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // update expense
  static async updateExpense(paymentData) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      moment.tz.setDefault("Asia/Beirut");
      paymentData.payment_date = moment(paymentData.payment_date).format(
        `YYYY-MM-DD HH:mm:ss`
      );

      const [[voucherCheck]] = await connection.query(
        `SELECT * FROM journal_vouchers WHERE journal_id = ?`,
        [paymentData.journal_id]
      );

      if (!voucherCheck) throw new Error("Voucher not found");

      // update journal vouchers and journal items
      let query = `UPDATE journal_vouchers SET journal_date = ?, journal_description = ?, journal_notes = ?,  total_value = ?, updated_at = ? WHERE journal_id = ?`;
      await connection.query(query, [
        paymentData.payment_date,
        paymentData.journal_description,
        paymentData.journal_notes,
        paymentData.amount,
        moment().format("YYYY-MM-DD HH:mm:ss"),
        paymentData.journal_id,
      ]);

      let [_531] = await Accounts.getIdByAccountNumber("531");

      await connection.query(
        `UPDATE journal_items SET credit = ?, journal_date = ? WHERE journal_id_fk = ? AND account_id_fk = ?`,
        [
          paymentData.amount,
          paymentData.payment_date,
          paymentData.journal_id,
          _531.id,
        ]
      );

      let [_6112] = await Accounts.getIdByAccountNumber("6112");
      await connection.query(
        `UPDATE journal_items SET debit = ?, journal_date = ?, account_id_fk = ? WHERE journal_id_fk = ? AND account_id_fk != ?`,
        [
          paymentData.amount,
          paymentData.payment_date,
          _6112.id,
          paymentData.journal_id,
          _531.id,
        ]
      );

      voucherCheck.updated_at = moment().format("YYYY-MM-DD HH:mm:ss");
      voucherCheck.update_reason = paymentData.update_reason;

      delete voucherCheck.deleted_at;
      delete voucherCheck.delete_reason;

      await connection.query(`INSERT INTO expenses_edits SET ?`, voucherCheck);

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // delete expense
  static async deleteExpense(journal_id, message) {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      await connection.query(
        `UPDATE journal_items SET is_deleted = 0 WHERE journal_id_fk = ?`,
        journal_id
      );

      await connection.query(
        `UPDATE journal_vouchers SET is_deleted = 1, deleted_at = ?, delete_reason = ? WHERE journal_id = ?`,
        [moment().format("YYYY-MM-DD HH:mm:ss"), message, journal_id]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // fetch edit history
  static async fetchEditHistory(id) {
    const query = `SELECT * FROM expenses_edits WHERE journal_id = ? ORDER BY updated_at DESC`;

    const [rows] = await pool.query(query, [id]);

    return rows;
  }

  // fetch deleted history
  static async fetchDeletedHistory() {
    const [_531] = await Accounts.getIdByAccountNumber("531");
    const query = `SELECT
        jv.journal_id,
        jv.journal_number,
        jv.journal_description,
		jv.journal_notes,
        jv.journal_date as payment_date,
        jv.total_value,
		jv.updated_at,
		jv.update_reason,
		jv.deleted_at,
		jv.delete_reason,
        ji.account_id_fk

        FROM journal_vouchers jv

        INNER JOIN journal_items ji ON jv.journal_id = ji.journal_id_fk

        WHERE jv.journal_number LIKE 'EXP%'
		AND jv.is_deleted = 1
        AND ji.account_id_fk != ?
        ORDER BY jv.journal_date DESC`;
    const [expenses] = await pool.query(query, [_531.id]);
    return expenses;
  }
}

module.exports = Expense;
