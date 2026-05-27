const pool = require("../config/database");

class PetMedia {
    static async getByPetId(pet_id) {
        const [rows] = await pool.query(
            "SELECT * FROM pet_media WHERE pet_id = ? ORDER BY record_id DESC",
            [pet_id],
        );
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query(
            "SELECT * FROM pet_media WHERE record_id = ?",
            [id],
        );
        return rows[0];
    }

    static async create(data) {
        const [result] = await pool.query("INSERT INTO pet_media SET ?", data);
        return result;
    }

    static async update(id, data) {
        await pool.query("UPDATE pet_media SET ? WHERE record_id = ?", [
            data,
            id,
        ]);
    }

    static async delete(id) {
        await pool.query("DELETE FROM pet_media WHERE record_id = ?", [id]);
    }
}

module.exports = PetMedia;
