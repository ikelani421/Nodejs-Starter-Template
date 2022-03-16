import { createLogger, transports, format } from 'winston';
import dotenv from 'dotenv';
import envData from '../configs/envData';

dotenv.config();

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: './logs/all-logs.log',
      json: false,
      maxsize: 5242880,
      maxFiles: 3,
      colorize: false
    }),
    new transports.File({
      filename: './logs/error-logs.log',
      json: true,
      maxsize: 5242880,
      maxFiles: 5,
      level: 'error',
      colorize: false,
    }),
  ],
});

if (envData.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple(),
    level: 'debug',
    json: false,
  }));
}

logger.stream = {
  write: (message) => logger.info(message.substring(0, message.lastIndexOf('\n')))
};

export default logger;
