const fs = require("fs");
const path = require("path");

const ensureErrorDirectoryExists = (directory) => {
	if (!fs.existsSync(directory)) {
		fs.mkdirSync(directory, { recursive: true });
	}
};

const errorHandler = (err, req, res, next) => {
	console.log(err);

	const errorDirectory = path.join(__dirname, "../errors");
	ensureErrorDirectoryExists(errorDirectory);

	const errorLogPath = path.join(errorDirectory, "error.log");

	// Always create the file if it doesn't exist
	if (!fs.existsSync(errorLogPath)) {
		fs.writeFileSync(errorLogPath, "");
	}

	const timestamp = new Date().toISOString();
	const logMessage = `${timestamp} [ERROR]: ${err}\n`;

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
