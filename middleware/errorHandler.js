const fs = require("fs");
const path = require("path");

// Resolve + create the log directory ONCE at startup, off the request path.
// (Previously every error response did sync fs.existsSync + writeFileSync, which
// blocks the single event loop — and errors spike exactly when the app is
// already struggling, amplifying stalls into missed socket.io pings.)
const errorDirectory = path.join(__dirname, "../errors");
try {
	fs.mkdirSync(errorDirectory, { recursive: true });
} catch (e) {
	console.error("Could not create error log directory:", e.message);
}
const errorLogPath = path.join(errorDirectory, "error.log");

const errorHandler = (err, req, res, next) => {
	console.log(err);

	const timestamp = new Date().toISOString();
	const logMessage = `${timestamp} [ERROR]: ${err}\n`;

	// async append only — never block the event loop on the error path.
	// appendFile creates the file if it doesn't exist, so no sync pre-checks.
	fs.appendFile(errorLogPath, logMessage, (writeErr) => {
		if (writeErr) {
			console.error("Failed to write to log file:", writeErr);
		}
	});

	if (err.errno === 1062) {
		res.status(400).send(err.sqlMessage);
	} else {
		res.status(500).json({ error: "Internal Server Error" });
	}
};

module.exports = errorHandler;
