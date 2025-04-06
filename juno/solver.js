export default class Solver {
  constructor() {
    this.board = Array.from({ length: 8 }, () => Array(7).fill(0));

    this.pieces = [
      { template: [[1,1,1],[1,0,0],[1,0,0]], }, // corner
      { template: [[1,1,0],[0,1,0],[0,1,1]], }, // z
      { template: [[1,1],[1,0],[1,0]] }, // little l
      { template: [[0,1,1],[1,1,0]] }, // s
      { template: [[1],[1],[1],[1]] }, // i
      { template: [[1,1,0],[1,1,1]] }, // thumb
      { template: [[1,1],[0,1],[1,1]] }, // c
      { template: [[0,1],[0,1],[0,1],[1,1]] }, // big L
      { template: [[1,0,0],[1,1,1],[1,0,0]] }, // t
      { template: [[1,1,1,0],[0,0,1,1]] },  // lightning
    ];

    this._setup();

  }

  _setup() {
    // the unused cells
    const cuts = [[6,0], [6,1], [0,7], [1,7], [2,7], [3,7]];

    // find month, date, day, and mark those board cells
    const date = new Date();
    let d = date.getDate();
    let m = date.getMonth() + 1; // Months are zero-based
    let w = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
    let xd = this._getid(this._getXy(d + 13));
    this.board[xd[1]][xd[0]] = -1;
    let xm = this._getid(this._getXy(m - 1 + (m > 6 ? 1 : 0)));
    this.board[xm[1]][xm[0]] = -1;
    let xw = this._getid(this._getXy(w + 45 + (w > 3 ? 4 : 0)));
    this.board[xw[1]][xw[0]] = -1;

    this._clear();
  }

  _clear() {
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.board[y][x] !== -1) {
          this.board[y][x] = 0;
        }
      }
    }
  }

  _getid(xy) {
    const [x, y] = xy;
    return `${x}${y}`;
  }

  _getXy(i) {
    return [i % 7, Math.floor(i / 7)];
  }

  _place(shape, xy, value) {
    const [offsetX, offsetY] = xy;
    shape.template.forEach((row, dy) => {
      row.forEach((cell, dx) => {
      if (cell === 1) {
        const x = offsetX + dx;
        const y = offsetY + dy;
        if (x >= 0 && x < 7 && y >= 0 && y < 8) {
          this.board[y][x] = value;
        }
      }
      });
    });
  }

  tryNext() {
    this._place(this.pieces[0], [0, 0], 1);
    this._place(this.pieces[1], [4, 0], 2);
    this._place(this.pieces[2], [1, 1], 3);
    this._place(this.pieces[3], [2, 1], 4);
    this._place(this.pieces[4], [0, 3], 5);
    this._place(this.pieces[5], [2, 3], 6);
    this._place(this.pieces[6], [4, 3], 7);
    this._place(this.pieces[7], [5, 3], 8);
    this._place(this.pieces[8], [1, 4], 9);
    this._place(this.pieces[9], [2, 6], 10);
  }
}
