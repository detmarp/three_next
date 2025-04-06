export default class Solver {
  constructor() {
    this.board = Array.from({ length: 8 }, () => Array(7).fill(0));

    const cuts = [[6,0], [6,1], [0,7], [1,7], [2,7], [3,7]];

    cuts.forEach(([x, y]) => {
      this.board[y][x] = -1;
    });

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
  }

  _getid(xy) {
    const [x, y] = xy;
    return `${x}${y}`;
  }

  _getXy(i) {
    return [i % 7, Math.floor(i / 7)];
  }

  tryNext() {
    let x, y;
    for (x = 0; x < 7; x++) {
      for (y = 0; y < 8; y++) {
        if (this.board[y][x] < 0) {
          continue;
        }
        this.board[y][x] = Math.floor(Math.random() * 10) + 1;
      }
    }
  }
}
