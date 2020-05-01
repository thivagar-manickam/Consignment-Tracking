const { createLogger, format, transports } = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs-extra");
const logDir = "log";

if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const dailyRotate = new transports.DailyRotateFile({
  filename: `${logDir}/%DATE%.log`,
  datePattern: "DD-MM-YYYY",
});

const logger = createLogger({
  level: "debug",
  format: format.combine(
    format.timestamp({
      format: "DD-MM-YYYY HH:mm:ss",
    }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: "debug",
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`
        )
      ),
    }),
    dailyRotate,
  ],
});

module.exports = logger;
