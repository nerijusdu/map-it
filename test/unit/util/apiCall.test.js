import shortId from 'shortid';
import moment from 'moment';
import { ApiCall } from '@/services/api/apiCall';
import MockStore from '../mocks/store';

let instance;
// TODO: update when error handling will be implemented
global.console = {
  warn: jest.fn(),
  error: jest.fn()
};

describe('apiCall', () => {
  beforeEach(() => {
    fetch.resetMocks();
    instance = new ApiCall();
    console.warn.mockClear();
  });

  it('call > should return result', async () => {
    instance.parseResponse = x => x.json();
    instance.handleErrors = x => x;

    const expectedResult = shortId.generate();
    fetch.mockResponseOnce(JSON.stringify(expectedResult), { status: 200, ok: true });

    const response = await instance.call('testurl');

    expect(response).toBe(expectedResult);
  });

  it('call > should handle all errors', async () => {
    instance.parseResponse = x => x.json();
    instance.handleErrors = () => {
      throw new Error('TestError');
    };

    const expectedResult = shortId.generate();
    fetch.mockResponseOnce(JSON.stringify(expectedResult), { status: 200, ok: true });

    const response = await instance.call('testurl');

    expect(response).toBeNull();
    expect(console.error).toBeCalled();
  });

  it('appendToken > when token is not set', () => {
    const store = {
      getters: {
        'app/getToken': null
      }
    };
    instance = new ApiCall(store);
    const headers = new Headers();

    instance.appendToken(headers);

    expect(headers.has('Authorization')).toBeFalsy();
  });

  it('appendToken > when token is set', async () => {
    const store = new MockStore({
      actions: {
        'app/getToken': () => 'TestToken'
      },
      state: {
        app: {
          user: {
            expiresAt: moment().add(1, 'hour')
          }
        }
      }
    });
    instance = new ApiCall(store);
    const headers = new Headers();

    await instance.appendToken(headers, {});

    expect(headers.get('Authorization')).toBe('Bearer TestToken');
  });

  it('parse response', async () => {
    const expectedData = shortId.generate();
    const res = {
      status: 200,
      ok: true,
      json: () => new Promise((resolve) => {
        resolve(expectedData);
      })
    };

    const result = await instance.parseResponse(res);

    expect(result).toBeDefined();
    expect(result.status).toBe(res.status);
    expect(result.ok).toBe(res.ok);
    expect(result.data).toBe(expectedData);
  });

  it('handle errors > when not OK', () => {
    const res = {
      ok: false,
      data: {
        message: shortId.generate()
      }
    };

    const result = instance.handleErrors(res);

    expect(result).toBeNull();
  });

  it('handle errors > when OK', () => {
    const res = {
      ok: true,
      data: {
        message: shortId.generate()
      }
    };

    const result = instance.handleErrors(res);

    expect(result).toBe(res);
    expect(console.warn).toHaveBeenCalledTimes(0);
  });

  it('should have default headers', () => {
    expect(instance.defaultHeaders().get('Content-Type')).toBe('application/json');
  });
});
