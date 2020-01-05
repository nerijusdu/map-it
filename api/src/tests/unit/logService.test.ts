// tslint:disable: no-string-literal
import { expect } from 'chai';
import mockfs from 'mock-fs';
import path from 'path';
import shortid from 'shortid';
import { ImportMock } from 'ts-mock-imports';
import logsService, { logFile } from '../../services/logsService';
import * as storageService from '../../services/storageService';

let storageServiceMock = ImportMock.mockClass(storageService, 'StorageService');
const logPath = path.resolve(__dirname, '../../../', logFile);

const generateLogEntry = () => ({
  log_id: shortid.generate(),
  level: shortid.generate(),
  message: shortid.generate(),
  timestamp: shortid.generate()
});

after(() => mockfs.restore());

describe('LogsService.getAll tests', () => {
  before(() => {
    storageServiceMock = ImportMock.mockClass(storageService, 'StorageService');
  });
  after(() => {
    storageServiceMock.restore();
  });

  it('should get all logs', async () => {
    const service = logsService();
    const logEntry = generateLogEntry();
    service['readLogs'] = () => Promise.resolve([logEntry]);

    const result = await service.getAll();
    expect(result).to.exist;
    expect(result.pageCount).to.equal(1);
    expect(result.pageNumber).to.equal(1);
    expect(result.items).to.be.an('array');
    expect(result.items.length).to.equal(1);
    expect(result.items[0].log_id).to.equal(logEntry.log_id);
    expect(result.items[0].level).to.equal(logEntry.level);
    expect(result.items[0].message).to.equal(logEntry.message);
    expect(result.items[0].timestamp).to.equal(logEntry.timestamp);
  });

  it('should get filter by level', async () => {
    const service = logsService();
    const logEntry = generateLogEntry();
    service['readLogs'] = () => Promise.resolve([
      generateLogEntry(),
      logEntry,
      generateLogEntry()
    ]);

    const result = await service.getAll({ level: logEntry.level });
    expect(result).to.exist;
    expect(result.items.length).to.equal(1);
    expect(result.items[0].log_id).to.equal(logEntry.log_id);
  });

  it('should return correct page items', async () => {
    const service = logsService();
    const logEntry = generateLogEntry();
    service['readLogs'] = () => Promise.resolve([
      generateLogEntry(),
      logEntry,
      generateLogEntry()
    ]);

    const result = await service.getAll({
      pageSize: 1,
      page: 2
    });

    expect(result).to.exist;
    expect(result.pageCount).to.equal(3);
    expect(result.pageNumber).to.equal(2);
    expect(result.items.length).to.equal(1);
    expect(result.items[0].log_id).to.equal(logEntry.log_id);
  });
});

describe('LogsService.getById tests', () => {
  before(() => {
    storageServiceMock = ImportMock.mockClass(storageService, 'StorageService');
  });
  after(() => {
    storageServiceMock.restore();
  });

  it('should get all logs', async () => {
    const service = logsService();
    const logEntry = generateLogEntry();
    service['readLogs'] = () => Promise.resolve([
      generateLogEntry(),
      logEntry,
      generateLogEntry()
    ]);

    const result = await service.getById(logEntry.log_id);
    expect(result).to.exist;
    expect(result!.log_id).to.equal(logEntry.log_id);
    expect(result!.level).to.equal(logEntry.level);
    expect(result!.message).to.equal(logEntry.message);
    expect(result!.timestamp).to.equal(logEntry.timestamp);
  });
});

const env: any = {};
describe('LogsService.clear tests', () => {
  beforeEach(() => {
    env.LOGS_BLOB_NAME = process.env.LOGS_BLOB_NAME;
  });
  afterEach(() => {
    process.env.LOGS_BLOB_NAME = env.LOGS_BLOB_NAME;
  });
  before(() => {
    storageServiceMock = ImportMock.mockClass(storageService, 'StorageService');
  });
  after(() => {
    storageServiceMock.restore();
  });

  it('should clear from file', async () => {
    process.env.LOGS_BLOB_NAME = '';
    const service = logsService();
    const config: any = {};
    config[logPath] = JSON.stringify(generateLogEntry());
    mockfs(config);
    service['logCache'] = [generateLogEntry()];

    await service.clear();
    expect(service['logCache']).to.be.undefined;

    const logs = await service.getAll();
    expect(logs.items.length).to.equal(0);
  });

  it('should clear from blob storage', async () => {
    let blobCleared = false;
    storageServiceMock.set('clearBlob', () => {
      blobCleared = true;
      return Promise.resolve();
    });
    process.env.LOGS_BLOB_NAME = shortid.generate();
    const service = logsService();
    service['logCache'] = [generateLogEntry()];

    await service.clear();
    expect(blobCleared).to.be.equal(true);
    expect(service['logCache']).to.be.undefined;
  });
});

describe('LogsService.readLogs tests', () => {
  before(() => {
    storageServiceMock = ImportMock.mockClass(storageService, 'StorageService');
  });
  after(() => {
    storageServiceMock.restore();
  });

  it('should get logs from cache', async () => {
    const service = logsService();
    const logEntry = generateLogEntry();
    service['logCache'] = [logEntry];

    const result = await service['readLogs']();
    expect(result).to.be.an('array');
    expect(result.length).to.equal(1);
    expect(result[0].log_id).to.equal(logEntry.log_id);
  });

  it('should get logs from file', async () => {
    process.env.LOGS_BLOB_NAME = '';
    const service = logsService();
    const logEntry = generateLogEntry();
    service['logCache'] = [generateLogEntry()];
    const config: any = {};
    config[logPath] =
      JSON.stringify(logEntry) +
      '\r\n' +
      JSON.stringify(generateLogEntry());
    mockfs(config);

    const result = await service['readLogs'](true);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(2);
    expect(result[0].log_id).to.equal(logEntry.log_id);
    expect(service['logCache'].length).to.equal(2);
    expect(service['logCache'][0].log_id).to.equal(logEntry.log_id);
  });

  it('should get logs from blob', async () => {
    storageServiceMock.set('getBlobText', () => Promise.resolve(
      JSON.stringify(logEntry) +
      '\r\n' +
      JSON.stringify(generateLogEntry())
    ));
    process.env.LOGS_BLOB_NAME = shortid.generate();
    const service = logsService();
    const logEntry = generateLogEntry();
    service['logCache'] = [generateLogEntry()];

    const result = await service['readLogs'](true);
    expect(result).to.be.an('array');
    expect(result.length).to.equal(2);
    expect(result[0].log_id).to.equal(logEntry.log_id);
    expect(service['logCache'].length).to.equal(2);
    expect(service['logCache'][0].log_id).to.equal(logEntry.log_id);
  });
});
