import moment from 'moment';

export default {
  getParagraphs: text => (text || '').split('\n'),
  calculateWidthPercentage(allTimeFrame, objectTimeframe, isMargin) {
    if (!allTimeFrame || !allTimeFrame.startDate || !allTimeFrame.endDate || !objectTimeframe || !objectTimeframe.startDate || !objectTimeframe.endDate) {
      throw new Error('Incorrect arguments provided!');
    }
    if (!moment.isMoment(allTimeFrame.startDate) || !moment.isMoment(allTimeFrame.endDate) || !moment.isMoment(objectTimeframe.startDate) || !moment.isMoment(objectTimeframe.endDate)) {
      throw new Error('Dates must be \'moment\' objects!');
    }

    if (objectTimeframe.startDate.isSame(objectTimeframe.endDate, 'day')) {
      return 0;
    }

    const a = {
      startDate: moment(allTimeFrame.startDate).startOf('day'),
      endDate: moment(allTimeFrame.endDate).endOf('day')
    };
    const b = {
      startDate: moment(objectTimeframe.startDate).startOf('day'),
      endDate: moment(objectTimeframe.endDate).endOf('day')
    };

    if (isMargin === true) {
      b.endDate.startOf('day');
    }

    if (b.endDate.isAfter(a.endDate)) {
      b.endDate = a.endDate;
    }
    if (b.startDate.isBefore(a.startDate)) {
      b.startDate = a.startDate;
    }

    const allDays = Math.abs(a.startDate.diff(a.endDate, 'hours'));
    const objectDays = Math.abs(b.startDate.diff(b.endDate, 'hours'));

    return Math.round((objectDays / allDays) * 10000) / 100;
  }
};
