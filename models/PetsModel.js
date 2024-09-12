const pool = require("../config/database");
const moment = require("moment-timezone");

const Customer = require("../models/CustomersModel");

class Pet {
	// fetch pets
	static async fetchPets(criteria) {
		let sql = `SELECT P.*, A.name, A.phone, A.address
		FROM pets P
		LEFT JOIN accounts A ON P.customer_id_fk = A.account_id
		LEFT JOIN medical_history H ON P.pet_id = H.pet_id_fk
		WHERE P.is_deleted = 0`;
		const params = [];
		if (criteria.customer_id_fk) {
			sql += ` AND P.customer_id_fk = ?`;
			params.push(`${criteria.customer_id_fk}`);
		}
		if (criteria.phone) {
			sql += ` AND A.phone = ?`;
			params.push(criteria.phone);
		}
		if (criteria.pet_name) {
			sql += ` AND P.pet_name LIKE ?`;
			params.push(`%${criteria.pet_name}%`);
		}
		if (criteria.medical_history) {
			sql += ` AND  H.medical_description LIKE ?`;
			params.push(`%${criteria.medical_history}%`);
		}

		sql += ` GROUP BY P.pet_id
		 ORDER BY pet_id DESC
        LIMIT ? OFFSET ?`;
		params.push(criteria.limit || 50);
		params.push(criteria.offset || 0);

		const [rows] = await pool.query(sql, params);
		return rows;
	}

	// get all pets
	static async getAll() {
		const query = `SELECT P.*, A.name, A.phone, A.address
		FROM pets P
		LEFT JOIN accounts A ON P.customer_id_fk = A.account_id
		WHERE P.is_deleted = 0 ORDER BY pet_id DESC`;
		let [rows] = await pool.query(query);
		return rows;
	}

	// get by id
	static async getById(id) {
		const query = `SELECT P.*, A.name, A.phone, A.address
		FROM pets P
		LEFT JOIN accounts A ON P.customer_id_fk = A.account_id
		WHERE P.is_deleted = 0 AND pet_id = ?`;
		let [rows] = await pool.query(query, id);
		return rows;
	}

	// create
	static async create(data) {
		const connection = await pool.getConnection();
		try {
			await connection.beginTransaction();

			let petData = {
				profile_number: data.profile_number,
				pet_name: data.pet_name,
				species: data.species,
				breed: data.breed,
				gender: data.gender,
				birthdate: data.birthdate,
				notes: data.notes,
				customer_id_fk: data.customer_id_fk,
			};

			if (data.customer_option == "create_new") {
				// customer object
				let customerData = {
					name: data.name,
					phone: data.phone,
					address: data.address,
				};
				// create customer model
				const createdCustomer = await Customer.createCustomer(
					customerData,
					connection
				);

				petData.customer_id_fk = createdCustomer.insertId;
			} else if (data.customer_option == "select_customer") {
				petData.customer_id_fk = data.customer_id_fk;
			}

			const [createdPet] = await connection.query(
				`INSERT INTO pets SET ?`,
				petData
			);

			// generate profile_number
			let [[{ profile_number }]] = await connection.query(
				`SELECT IFNULL(MAX(profile_number), 1000) + 1 AS profile_number FROM pets`
			);

			// update profile with profile number
			await connection.query(
				`UPDATE pets SET profile_number = ? WHERE pet_id = ?`,
				[profile_number, createdPet.insertId]
			);
			await connection.commit();
			return [createdPet];
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

			// pet object
			let petData = {
				profile_number: data.profile_number,
				pet_name: data.pet_name,
				species: data.species,
				breed: data.breed,
				gender: data.gender,
				birthdate: data.birthdate,
				notes: data.notes,
				customer_id_fk: data.customer_id_fk,
			};

			if (data.customer_option == "create_new") {
				// customer object
				let customerData = {
					name: data.name,
					phone: data.phone,
					address: data.address,
				};
				// create customer model
				const createdCustomer = await Customer.createCustomer(
					customerData,
					connection
				);

				petData.customer_id_fk = createdCustomer.insertId;

				await connection.query(`UPDATE pets SET ? WHERE pet_id = ?`, [
					petData,
					data.pet_id,
				]);
				await connection.commit();
			} else if (data.customer_option == "select_customer") {
				await connection.query(`UPDATE pets SET ? WHERE pet_id = ?`, [
					petData,
					data.pet_id,
				]);
				await connection.commit();
			}
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// delete
	static async delete(id) {
		const connection = await pool.getConnection();
		try {
			// begin transaction
			await connection.beginTransaction();

			// delete from medical history
			await connection.query('DELETE FROM medical_history WHERE pet_id_fk = ?', id)

			// delete transactions
			await connection.query(
				`DELETE FROM pets WHERE pet_id = ?`, id);

			// commit transaction
			await connection.commit();
		} catch (error) {
			await connection.rollback();
			throw error;
		} finally {
			connection.release();
		}
	}

	// fetch history
	static async fetchMedicalHistory(pet_id) {
		let query = `SELECT * FROM medical_history WHERE pet_id_fk = ? ORDER BY record_datetime DESC`;

		const [rows] = await pool.query(query, pet_id);
		return rows;
	}

	// fetch history by record id
	static async fetchMedicalHistoryById(id) {
		let query = `SELECT * FROM medical_history WHERE record_id = ?`;
		const [rows] = await pool.query(query, id);
		return rows;
	}

	// create history
	static async createMedicalHistory(data) {
		let query = `INSERT INTO medical_history SET ?`;
		let [rows] = await pool.query(query, data);

		return rows;
	}

	// update history
	static async updateMedicalHistory(data) {
		let record = {
			medical_description: data.medical_description,
			medical_notes: data.medical_notes,
		};
		let query = `UPDATE medical_history SET ? WHERE record_id = ?`;
		await pool.query(query, [record, data.record_id]);
	}

	// delete history
	static async deleteMedicalHistory(id) {
		let query = `UPDATE medical_history SET is_deleted = 1 WHERE record_id = ?`;
		await pool.query(query, id);
	}
}

module.exports = Pet;
