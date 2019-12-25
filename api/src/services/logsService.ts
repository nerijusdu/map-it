import fs from 'fs';
import readline from 'readline';
import { LogEntry } from 'winston';
import { logsDir } from '../config';
import { IPagedRequest, IPagedResult } from '../models/pagingModels';
import { StorageService } from './storageService';

interface IQueryOptions extends IPagedRequest {
  level?: string;
}

class LogsService {
  private logCache: LogEntry[];
  private storageService: StorageService;

  constructor() {
    if (!process.env.LOGS_BLOB_NAME) {
      return;
    }

    this.storageService = new StorageService(
      process.env.LOGS_BLOB_ACCOUNT_NAME!,
      process.env.LOGS_BLOB_ACCOUNT_SECRET!);
  }

  public async getAll(options: IQueryOptions = {}): Promise<IPagedResult<LogEntry>> {
    const pageSize = options.pageSize || 25;
    const page = options.page || 1;
    const start = (page - 1) * pageSize;
    // pageSize becomes a string for no fucking reason
    // thats why (pageSize * 1)
    const end = start + (pageSize * 1);

    const result = await this.readLogs(true);

    const allItems = options.level
      ? result.filter((x: LogEntry) => x.level === options.level)
      : result;
    const items = allItems
      .slice(start, end)
      .map((log) => ({
        log_id: log.log_id,
        level: log.level,
        message: log.message,
        timestamp: log.timestamp
      }));

    return {
      pageCount: Math.ceil(allItems.length / pageSize),
      pageNumber: 1,
      items
    };
  }

  public async getById(id: string) {
    const result = await this.readLogs();
    return result.find((x: LogEntry) => x.log_id === id);
  }

  private async readLogs(noCache: boolean = false) {
    if (noCache || !this.logCache) {
      const result = process.env.LOGS_BLOB_NAME
        ? await this.readLogsFromBlob()
        : await this.readLogsFromFile();
      this.logCache = result;
    }

    return this.logCache;
  }

  private readLogsFromFile(): Promise<LogEntry[]> {
    return new Promise((resolve) => {
      const readInterface = readline.createInterface({
        input: fs.createReadStream(`${logsDir}/api.log`)
      });
      const items: LogEntry[] = [];
      readInterface.on('line', (line) => {
        items.push(JSON.parse(line));
      });
      readInterface.on('close', () => resolve(items));
    });
  }

  private async readLogsFromBlob(): Promise<LogEntry[]> {
    const file = await this.storageService.getBlobText('map-it-logs', 'api.log');
    return file
      .split(/\r?\n/)
      .filter((str) => !!(str || '').trim())
      .map((str) => JSON.parse(str));
  }
}

export default () => new LogsService();
