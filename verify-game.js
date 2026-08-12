const assert = require('assert');

function countMines(cells) {
  cells.forEach((c, i) => {
    const r = Math.floor(i / 8), col = i % 8;
    c.n = cells.reduce((total, x, j) => {
      if (j === i) return total;
      return total + (x.mine && Math.abs(Math.floor(j / 8) - r) <= 1 && Math.abs(j % 8 - col) <= 1 ? 1 : 0);
    }, 0);
  });
}

function protectFirstMove(cells, i) {
  const r = Math.floor(i / 8), col = i % 8, protectedCells = [];
  for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
    const nr = r + dr, nc = col + dc;
    if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) protectedCells.push(nr * 8 + nc);
  }
  protectedCells.filter(j => cells[j].mine).forEach(from => {
    const replacement = cells.findIndex((c, j) => !protectedCells.includes(j) && !c.mine && !c.flag);
    if (replacement >= 0) {
      cells[from].mine = false;
      cells[replacement].mine = true;
    }
  });
  countMines(cells);
}

for (let run = 0; run < 5000; run++) {
  const cells = Array.from({ length: 64 }, () => ({ mine: false, flag: false, n: 0 }));
  Array.from({ length: 64 }, (_, i) => i).sort(() => Math.random() - .5).slice(0, 10).forEach(i => cells[i].mine = true);
  const first = Math.floor(Math.random() * 64);
  protectFirstMove(cells, first);
  assert.equal(cells.filter(c => c.mine).length, 10);
  assert.equal(cells[first].mine, false);
  assert.equal(cells[first].n, 0);
  cells.forEach((c, i) => {
    const r = Math.floor(i / 8), col = i % 8;
    const expected = cells.reduce((n, x, j) => n + (j !== i && x.mine && Math.abs(Math.floor(j / 8) - r) <= 1 && Math.abs(j % 8 - col) <= 1 ? 1 : 0), 0);
    assert.equal(c.n, expected);
  });
}

const collocations = {
  MAKE: ['a decision','progress','a mistake','an effort','money','plans','a promise','a difference','a suggestion','an appointment'],
  DO: ['homework','business','research','exercise','your best','housework','a favour','the shopping','a course','the washing-up']
};
assert.equal(collocations.MAKE.filter(x => collocations.DO.includes(x)).length, 0);
assert.equal(collocations.MAKE.length, 10);
assert.equal(collocations.DO.length, 10);
console.log('5000 minefields and MAKE/DO data passed');
