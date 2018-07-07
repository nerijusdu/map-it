import moment from 'moment';
import * as functions from '@/util/functions.js';

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
