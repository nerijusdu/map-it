import moment from 'moment';
import { LogEntry, QueryOptions } from 'winston';
import logger from '../utils/logger';

const loggerQuery = (options: QueryOptions): Promise<any> => new Promise((resolve, reject) => {
  logger.query(options, (err, res) => {
    if (err) {
      reject(err);
      return;
    }
    resolve(res);
  });
});

class LogsService {
  public async getAll(options: IQueryOptions = {}) {
    const result = await loggerQuery({
      from: new Date(options.from || moment().add(-1, 'week').format('YYYY-MM-DD')),
      limit: options.limit || 100,
      start: options.start,
      fields: ['message', 'level', 'log_id', 'timestamp']
    });

    return result.file.filter((x: LogEntry) => x.level === (options.level || 'info'));
  }

  public async getById(id: string) {
    const result = await loggerQuery({
      from: new Date('2000-01-01'),
      limit: 1000,
      fields: null
    });

    return result.file.find((x: LogEntry) => x.log_id === id);
  }
}

interface IQueryOptions {
  from?: string;
  limit?: number;
  start?: number;
  level?: string;
}

export default () => new LogsService();
