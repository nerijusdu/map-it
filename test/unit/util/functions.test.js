import moment from 'moment';
import * as functions from '@/services/formatService';
import { publicUrls, loginUrl } from '@/constants';

describe('Functions.calculateWidthPercentage', () => {
  it('should be 100%', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-08-31')
    };

    const res = functions.calculateWidthPercentage(allTimeFrame, allTimeFrame);

    expect(res).toBe(100);
  });

  it('should be 50%', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-30')
    };
    const objectTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-15')
    };

    const res = functions.calculateWidthPercentage(allTimeFrame, objectTimeFrame);

    expect(res).toBe(50);
  });

  it('should not accept incorrect params', () => {
    const nullValue = null;
    const emptyObject = {};
    const notMomentDates = {
      startDate: new Date('2018-07-01'),
      endDate: 'some string'
    };

    expect(() => functions.calculateWidthPercentage(nullValue, nullValue)).toThrowError();
    expect(() => functions.calculateWidthPercentage(emptyObject, emptyObject)).toThrowError();
    expect(() => functions.calculateWidthPercentage(notMomentDates, notMomentDates)).toThrowError();
  });

  it('should be 0%', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-30')
    };
    const objectTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-01')
    };

    const res = functions.calculateWidthPercentage(allTimeFrame, objectTimeFrame);

    expect(res).toBe(0);
  });
});

describe('Functions.getParagraphs', () => {
  it('when text is given', () => {
    const text = 'Test\nText\nFour\nLines';

    const result = functions.getParagraphs(text);

    expect(result).toBeDefined();
    expect(result.length).toBe(4);
  });

  it('when null is given', () => {
    const text = null;

    const result = functions.getParagraphs(text);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });
});

describe('Functions.authorizeRoutes', () => {
  it('should allow public urls', () => {
    const next = x => expect(x).toBeUndefined();

    publicUrls.forEach((x) => {
      functions.authorizeRoutes({ path: x }, null, next);
    });
  });

  it('should redirect to login when accessing non public url and no token is saved', () => {
    jest.mock('@/store', () => ({
      getters: {
        'app/getToken': null
      }
    }));
    const next = x => expect(x).toBe(loginUrl);

    functions.authorizeRoutes({ path: '/timeline' }, null, next);
  });

  it('should allow non public urls when token is saved', () => {
    jest.mock('@/store', () => ({
      getters: {
        'app/getToken': 'TestToken'
      }
    }));
    const next = x => expect(x).toBe(loginUrl);

    functions.authorizeRoutes({ path: '/timeline' }, null, next);
  });
});
