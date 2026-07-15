const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    multipleStatements: true,
    dateStrings: true,
    // utf8mb4 is required to store 4-byte characters such as emojis.
    // Without it the connection defaults to 3-byte utf8 and mangles them.
    charset: "utf8mb4",

    // ── pool sizing & fast-fail ──────────────────────────────────────────
    connectionLimit: 20,
    waitForConnections: true,
    // Bound the wait queue. With the default queueLimit:0 (unlimited) an
    // exhausted pool makes EVERY new request wait forever, which the reverse
    // proxy eventually turns into a 504. A finite limit makes overflow fail fast
    // with an error (surfaced as a 500) instead of hanging the whole app.
    queueLimit: 50,

    // Keep idle pooled sockets healthy so they aren't silently dropped by the DB
    // or a firewall (a dropped-but-pooled socket surfaces as a random query error).
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,

    // Cap how long establishing a NEW connection may take.
    connectTimeout: 20000,
});

// Startup health check. NOTE: this uses the promise API with a guaranteed
// release(). The previous callback form — pool.getConnection((err, conn) => …)
// on a mysql2/promise pool — never ran its callback, so the acquired connection
// was never released and one pool slot leaked permanently for the process life.
(async () => {
    try {
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        console.log("Database pool ready");
    } catch (err) {
        console.error(
            "Database connection failed:",
            err && (err.code || err.message),
        );
    }
})();

module.exports = pool;
