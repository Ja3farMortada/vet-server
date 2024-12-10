const pool = require("../config/database");
const Customer = require("../models/CustomersModel");

class Reservation {
	// get all reservations
	static async getAll() {
		let query = `SELECT R.*, A.name AS title, A.phone FROM reservations R LEFT JOIN accounts A ON R.customer_id_fk = A.account_id WHERE R.is_deleted = 0`;
		const [result] = await pool.query(query);

		return result;
	}

	// get by id
	static async getById(id) {
		let query = `SELECT R.*, A.name AS title, A.phone FROM reservations R LEFT JOIN accounts A ON R.customer_id_fk = A.account_id WHERE R.is_deleted = 0 AND id = ?`;
		const [result] = await pool.query(query, [id]);
		return result;
	}

	// create
	static async create(data) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			let reservationData = {
				start: data.start,
				end: data.end,
				backgroundColor: data.backgroundColor,
				borderColor: data.backgroundColor,
				notes: data.notes,
			};

			if (data.customer_option === "create_new") {
				// customer object
				let customerData = {
					name: data.title,
					phone: data.phone,
					address: data.address,
				};
				// create customer model
				const createdCustomer = await Customer.createCustomer(
					customerData,
					connection
				);

				reservationData.customer_id_fk = createdCustomer.insertId;
			} else {
				if (data.customer_id_fk) {
					reservationData.customer_id_fk = data.customer_id_fk;
				}
			}

			let query = `INSERT INTO reservations SET ?`;
			const [rows] = await pool.query(query, reservationData);

			await connection.commit();
			return rows;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// update
	static async update(data) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();
			let reservationData = {
				start: data.start,
				end: data.end,
				backgroundColor: data.backgroundColor,
				borderColor: data.backgroundColor,
				notes: data.notes,
			};

			if (data.customer_option === "create_new") {
				// customer object
				let customerData = {
					name: data.title,
					phone: data.phone,
					address: data.address,
				};
				// create customer model
				const createdCustomer = await Customer.createCustomer(
					customerData,
					connection
				);

				reservationData.customer_id_fk = createdCustomer.insertId;
			} else {
				reservationData.customer_id_fk = data.customer_id_fk;
			}

			let query = `UPDATE reservations SET ? WHERE id = ?`;
			const [rows] = await pool.query(query, [reservationData, data.id]);

			await connection.commit();
			return rows;
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
		// data.borderColor = data.backgroundColor;
		// let query = `UPDATE reservations SET ? WHERE id = ?`;
		// await pool.query(query, [data, data.id]);
	}

	// delete
	static async delete(id) {
		await pool.query(
			`UPDATE reservations SET is_deleted = 1 WHERE id = ?`,
			id
		);
	}
}

module.exports = Reservation;
