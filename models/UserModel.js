const pool = require("../config/database");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");

class User {
    // get all users except admin
    static async getAll() {
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE user_type = 'user' AND is_deleted = 0`,
        );
        return rows;
    }

    // get by id
    static async getById(id) {
        const [rows] = await pool.query(
            `SELECT * FROM users WHERE user_id = ?`,
            id,
        );
        return rows;
    }

    // validate by username
    static async getByUsername(username) {
        const [rows] = await pool.query(
            `SELECT username FROM users WHERE username = ? AND is_deleted = 0`,
            username,
        );
        return rows;
    }

    // validate by id and username
    static async getByIdAndUsername(id, username) {
        const [rows] = await pool.query(
            `SELECT username FROM users WHERE user_id != ?  AND username = ? AND is_deleted = 0`,
            [id, username],
        );
        return rows;
    }

    // validate by username and password
    static async getByUsernameAndPassword(username, password) {
        const [[rows]] = await pool.query(
            `SELECT * FROM users WHERE username = ? AND is_deleted = 0`,
            [username],
        );

        if (!rows) return null;

        // async bcrypt keeps the CPU-bound hash OFF the event loop (bcryptjs sync
        // form freezes the single thread ~80-120ms, stalling socket.io pings and
        // all other requests during login bursts).
        const verified = await bcrypt.compare(password, rows.password);
        if (verified) {
            const beirutTime = moment()
                .tz("Asia/Beirut")
                .format("YYYY-MM-DD HH:mm:ss");
            await pool.query(
                `UPDATE users SET last_login = ? WHERE username = ?`,
                [beirutTime, username],
            );
            return rows;
        }
        return null;
    }

    // validate password by user_id
    static async getByPassword(id) {
        const [rows] = await pool.query(
            `SELECT password FROM users WHERE user_id = ?`,
            id,
        );
        return rows;
    }

    // create user
    static async create(user) {
        user.password = await bcrypt.hash(user.password, 10);
        const [rows] = await pool.query(`INSERT INTO users SET ?`, user);
        return rows;
    }

    // update user
    static async update(user) {
        await pool.query(`UPDATE users SET ? WHERE user_id = ?`, [
            user,
            user.user_id,
        ]);
    }

    // update password
    static async updatePassword(user_id, password) {
        const hashed_password = await bcrypt.hash(password, 10);
        await pool.query(`UPDATE users SET password = ? WHERE user_id = ?`, [
            hashed_password,
            user_id,
        ]);
    }

    // delete user
    static async delete(id) {
        await pool.query(
            `UPDATE users SET is_deleted = 1 WHERE user_id = ?`,
            id,
        );
    }
}

module.exports = User;
