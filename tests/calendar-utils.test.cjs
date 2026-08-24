const assert = require('node:assert/strict');
const test = require('node:test');

const { createCalendarModel } = require('../calendar-utils.js');

test('createCalendarModel builds a five-week calendar for 2026-10-17 and highlights the wedding day', () => {
  const model = createCalendarModel('2026-10-17');

  assert.equal(model.displayMonth, '2026.10');
  assert.equal(model.displayDate, '2026.10.17');
  assert.deepEqual(model.weekdays, ['일', '월', '화', '수', '목', '금', '토']);
  assert.equal(model.weeks.length, 5);
  assert.deepEqual(
    model.weeks[0].map(cell => (cell ? cell.day : null)),
    [null, null, null, null, 1, 2, 3]
  );

  const highlighted = model.weeks
    .flat()
    .filter(cell => cell && cell.isWeddingDay)
    .map(cell => cell.day);

  assert.deepEqual(highlighted, [17]);
  assert.deepEqual(
    model.weeks[2].map(cell => (cell ? cell.day : null)),
    [11, 12, 13, 14, 15, 16, 17]
  );
});
