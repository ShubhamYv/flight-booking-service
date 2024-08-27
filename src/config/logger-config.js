const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} : ${level}: ${message}${stack ? '\n' + stack : ''}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info', // Default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Corrected timestamp format
    errors({ stack: true }), // Include stack trace if error object is passed
    customFormat
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' })
  ]
});

module.exports = logger;
