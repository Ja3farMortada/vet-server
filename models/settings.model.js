const pool = require("../config/database");

// ─── Migration (run once, manually) ──────────────────────────────────────────
// Adds the per-option text colour. Defaulted to white so existing options stay
// legible without a backfill (safe migration).
//
// ALTER TABLE reservation_options
//   ADD COLUMN option_text_color VARCHAR(9) NOT NULL DEFAULT '#ffffff' AFTER option_color;

class Settings {
    // ─── Reservation Options ─────────────────────────────────────────────────

    static async getAllReservationOptions() {
        const [rows] = await pool.query(
            "SELECT * FROM reservation_options ORDER BY option_id ASC"
        );
        return rows;
    }

    static async getReservationOptionById(id) {
        const [[row]] = await pool.query(
            "SELECT * FROM reservation_options WHERE option_id = ?",
            [id]
        );
        return row;
    }

    static async createReservationOption(data) {
        const [result] = await pool.query(
            "INSERT INTO reservation_options SET ?",
            data
        );
        return result;
    }

    static async updateReservationOption(id, data) {
        await pool.query(
            "UPDATE reservation_options SET ? WHERE option_id = ?",
            [data, id]
        );
    }

    static async deleteReservationOption(id) {
        await pool.query(
            "DELETE FROM reservation_options WHERE option_id = ?",
            [id]
        );
    }
}

module.exports = Settings;
