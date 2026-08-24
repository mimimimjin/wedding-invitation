(function (global, factory) {
  const api = factory();

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  }

  global.CalendarUtils = api;
})(typeof window !== 'undefined' ? window : globalThis, function () {
  'use strict';

  const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

  function pad2(value) {
    return String(value).padStart(2, '0');
  }

  function splitWeeks(cells) {
    const weeks = [];

    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return weeks;
  }

  function createCalendarModel(dateStr) {
    const [yearText, monthText, dayText] = dateStr.split('-');
    const year = Number(yearText);
    const month = Number(monthText);
    const day = Number(dayText);
    const firstWeekday = new Date(year, month - 1, 1).getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const cells = [];

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push(null);
    }

    for (let date = 1; date <= daysInMonth; date += 1) {
      cells.push({
        day: date,
        isWeddingDay: date === day
      });
    }

    while (cells.length % 7 !== 0) {
      cells.push(null);
    }

    return {
      year,
      month,
      day,
      displayMonth: `${year}.${pad2(month)}`,
      displayDate: `${year}.${pad2(month)}.${pad2(day)}`,
      weekdays: WEEKDAYS.slice(),
      weeks: splitWeeks(cells)
    };
  }

  return {
    createCalendarModel
  };
});
