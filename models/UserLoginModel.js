const pool = require("../config/database");
const moment = require("moment-timezone");

moment.tz.setDefault("Asia/Beirut");

class UserLogin {
    /**
     * Log a successful user login.
     * @param {number|string} userId
     * @returns {Promise<any>} mysql query result
     */
    static async create(userId) {
        const loginAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const [result] = await pool.query(
            `INSERT INTO users_logins (user_id, login_at) VALUES (?, ?)`,
            [userId, loginAt],
        );
        return result;
    }

    /**
     * Fetch login history for a given user.
     * @param {number|string} userId
     * @returns {Promise<any[]>} list of login logs
     */
    static async getByUserId(userId) {
        const [rows] = await pool.query(
            `SELECT * FROM users_logins WHERE user_id = ? ORDER BY login_at DESC`,
            [userId],
        );
        return rows;
    }
}

module.exports = UserLogin;
