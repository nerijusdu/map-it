import { createLogger, format, transports } from 'winston';
import { logsDir } from '../config';
// tslint:disable-next-line: no-var-requires
const azureBlobTransport = require('winston3-azureblob-transport');

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
      filename: `${logsDir}/api-errors.log`,
      level: 'error'
    }),
    new transports.File({
      filename: `${logsDir}/api.log`,
      level: 'info'
    })
  ]
});

if (process.env.NODE_ENV !== 'prod') {
  logger.add(new transports.Console({
    format: format.cli({level: true})
  }));
} else if (process.env.LOGS_BLOB_NAME) {
  logger.add(new azureBlobTransport({
    account: {
      account: {
        name: process.env.LOGS_BLOB_ACCOUNT_NAME,
        key: process.env.LOGS_BLOB_ACCOUNT_SECRET
      },
      containerName: process.env.LOGS_BLOB_CONTAINER,
      blobName: process.env.LOGS_BLOB_NAME,
      level: 'info',
      bufferLogSize : 1,
      syncTimeout : 0,
      rotatePeriod : '',
      eol : '\n'
    }
  }));
}

export default logger;
