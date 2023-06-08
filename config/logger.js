const { createLogger, transports, format } = require("winston");
const { dirname } = require("path");
const appDir = dirname(require.main.filename);
const { combine, timestamp, printf, align } = format;

const logger = createLogger({
  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new transports.Console({
      level: "info",
    }),
    new transports.File({
      filename: `${appDir}/logs/info.log`,
      level: "info",
    }),
    new transports.File({
      filename: `${appDir}/logs/error.log`,
      level: "error",
    }),
  ],
});

module.exports = logger;
