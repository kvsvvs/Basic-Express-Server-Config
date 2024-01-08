const winston = require("winston");
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

const logDir = "log";

// Ensure log directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  transports: [
    new winston.transports.DailyRotateFile({
      filename: path.join(logDir, "application-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
    }),
  ],
});

// Stream for morgan
logger.stream = {
  write: (message) => logger.info(message.trim()),
};

module.exports = logger;
