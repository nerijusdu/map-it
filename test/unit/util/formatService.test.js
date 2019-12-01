import moment from 'moment';
import formatService from '@/services/formatService';

describe('Functions.calculateWidthPercentage', () => {
  it('should be 100%', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-08-31')
    };

    const res = formatService.calculateWidthPercentage(allTimeFrame, allTimeFrame);

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

    const res = formatService.calculateWidthPercentage(allTimeFrame, objectTimeFrame);

    expect(Math.round(res)).toBe(50);
  });

  it('should not accept incorrect params', () => {
    const nullValue = null;
    const emptyObject = {};
    const notMomentDates = {
      startDate: new Date('2018-07-01'),
      endDate: 'some string'
    };

    expect(() => formatService.calculateWidthPercentage(nullValue, nullValue)).toThrowError();
    expect(() => formatService.calculateWidthPercentage(emptyObject, emptyObject)).toThrowError();
    expect(() => formatService.calculateWidthPercentage(notMomentDates, notMomentDates)).toThrowError();
  });

  it('should calculate correct for single day', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-30')
    };
    const objectTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-01')
    };

    const res = formatService.calculateWidthPercentage(allTimeFrame, objectTimeFrame);

    const allHours = Math.abs(allTimeFrame.startDate.diff(allTimeFrame.endDate, 'hours'));
    const expectedRes = Math.round((24 / allHours) * 10000) / 100;
    expect(res).toBeCloseTo(expectedRes, 0);
  });

  it('should end at start of last day for margin', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-30')
    };
    const objectTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-01')
    };

    const res = formatService.calculateWidthPercentage(allTimeFrame, objectTimeFrame, true);

    expect(res).toBe(0);
  });

  it('should not extend after all-time frame', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-30')
    };
    const objectTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-07-01')
    };

    const res = formatService.calculateWidthPercentage(allTimeFrame, objectTimeFrame);

    expect(res).toBeLessThanOrEqual(100);
  });

  it('should not extend before all-time frame', () => {
    const allTimeFrame = {
      startDate: moment('2018-06-01'),
      endDate: moment('2018-06-30')
    };
    const objectTimeFrame = {
      startDate: moment('2018-05-01'),
      endDate: moment('2018-06-30')
    };

    const res = formatService.calculateWidthPercentage(allTimeFrame, objectTimeFrame);

    expect(res).toBeLessThanOrEqual(100);
  });
});

describe('Functions.getParagraphs', () => {
  it('when text is given', () => {
    const text = 'Test\nText\nFour\nLines';

    const result = formatService.getParagraphs(text);

    expect(result).toBeDefined();
    expect(result.length).toBe(4);
  });

  it('when null is given', () => {
    const text = null;

    const result = formatService.getParagraphs(text);

    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });
});
