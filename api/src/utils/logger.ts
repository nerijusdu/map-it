import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()
  ),
  transports: [
    new transports.File({
      filename: 'logs/api-errors.log',
      level: 'error'
    }),
    new transports.File({
      filename: 'logs/api.log',
      level: 'info'
    })
  ]
});

if (process.env.NODE_ENV !== 'prod') {
  logger.add(new transports.Console({
    format: format.cli({level: true})
  }));
}

export default logger;
