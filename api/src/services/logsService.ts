import { LogEntry, QueryOptions } from 'winston';
import { IPagedRequest, IPagedResult } from '../models/pagingModels';
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

interface IQueryOptions extends IPagedRequest {
  level?: string;
}

class LogsService {
  public async getAll(options: IQueryOptions = {}): Promise<IPagedResult<LogEntry>> {
    const pageSize = options.pageSize || 25;
    const page = options.page || 1;
    const start = (page - 1) * pageSize;
    // pageSize becomes a string for no fucking reason
    // thats why (pageSize * 1)
    const end = start + (pageSize * 1);

    const result = await loggerQuery({
      from: new Date('2000-01-01'),
      limit: 10000,
      start: 0,
      fields: ['message', 'level', 'log_id', 'timestamp']
    });

    const allItems = options.level
      ? result.file.filter((x: LogEntry) => x.level === options.level)
      : result.file;
    const items = allItems.slice(start, end);
    return {
      pageCount: Math.ceil(allItems.length / pageSize),
      pageNumber: 1,
      items
    };
  }

  public async getById(id: string) {
    const result = await loggerQuery({
      from: new Date('2000-01-01'),
      limit: 10000,
      fields: null
    });

    return result.file.find((x: LogEntry) => x.log_id === id);
  }
}

export default () => new LogsService();
