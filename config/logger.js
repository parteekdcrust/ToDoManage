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

//  const winston = require("winston");
// const { combine, timestamp, printf, colorize, align } = winston.format;

// const { dirname } = require("path");
// const appDir = dirname(require.main.filename);

// const logger1 = winston.createLogger({
//   level: process.env.LOG_LEVEL || "debug",
//   format: combine(
//     timestamp({
//       format: "YYYY-MM-DD hh:mm:ss.SSS A",
//     }),
//     align(),
//     printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
//   ),
//   transports: [
//     new winston.transports.File({
//       filename: `${appDir}/logs/combined.log`,
//     }),
//     new winston.transports.File({
//       filename: `${appDir}/logs/error.log`,
//       level: "error",
//     }),
//     new winston.transports.Console(),
//   ],
//   exceptionHandlers: [new winston.transports.File({ filename: `${appDir}/logs/exception.log` })],
//   rejectionHandlers: [new winston.transports.File({ filename: `${appDir}/logs/rejection.log` })],
// });

// logger.exitOnError = false;

// logger.error("error");
// logger.warn("warn");
// logger.info("info");
// // logger.verbose("verbose");
// logger.debug("debug");
// // logger.silly("silly");

// logger.log("error", "error message");
// logger.log("info", "info message");

// module.exports = logger;
