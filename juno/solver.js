export default class Solver {
  constructor() {
    this.board = Array.from({ length: 8 }, () => Array(7).fill(0));

    this.pieces = [
      { n: 0, template: [[1,1,1],[1,0,0],[1,0,0]], }, // corner
      { n: 1, template: [[1,1,0],[0,1,0],[0,1,1]], }, // z
      { n: 2, template: [[1,1],[1,0],[1,0]] }, // little l
      { n: 3, template: [[0,1,1],[1,1,0]] }, // s
      { n: 4, template: [[1],[1],[1],[1]] }, // i
      { n: 5, template: [[1,1,0],[1,1,1]] }, // thumb
      { n: 6, template: [[1,1],[0,1],[1,1]] }, // c
      { n: 7, template: [[0,1],[0,1],[0,1],[1,1]] }, // big L
      { n: 8, template: [[1,0,0],[1,1,1],[1,0,0]] }, // t
      { n: 9, template: [[1,1,1,0],[0,0,1,1]] },  // lightning
    ];

    this._setup();

  }

  _setup() {
    // the unused cells
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

    this._clear();

    this.unused = new Set();
    for (let y = 0; y < 8; y++) {
      for (let x = 0; x < 7; x++) {
        if (this.board[y][x] === 0) {
          this.unused.add(this._getid([x, y]));
        }
      }
    }

    this.hand = new Set();
    for (let p = 0; p < this.pieces.length; p++) {
      this.hand.add(p);
    }
    this.played = new Set();
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
    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
      if (cell === 1) {
        const x = offsetX + dx;
        const y = offsetY + dy;
        if (x >= 0 && x < 7 && y >= 0 && y < 8) {
          this.board[y][x] = value;
          this.unused.delete(this._getid([x, y]));
        }
      }
      });
    });
  }

  _remove(shape, xy) {
    const [offsetX, offsetY] = xy;
    shape.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell === 1) {
          const x = offsetX + dx;
          const y = offsetY + dy;
          if (x >= 0 && x < 7 && y >= 0 && y < 8) {
            this.board[y][x] = 0;
            this.unused.add(this._getid([x, y]));
          }
        }
      });
    });
  }

  _rotate(template, turn, flip) {
    let shape = template.map(row => [...row]);

    // Apply horizontal flip if needed
    if (flip) {
      shape = shape.map(row => row.reverse());
    }

    // Apply rotations
    for (let t = 0; t < turn; t++) {
      shape = shape[0].map((_, colIndex) =>
        shape.map(row => row[colIndex])
      ).reverse();
    }

    return shape;
  }

  _allUnused(piece) {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          const id = this._getid([piece.x + x, piece.y + y]);
          if (!this.unused.has(id)) {
            return false;
          }
        }
      }
    }
    return true;
  }

  _noIslands(unused) {
    const directions = [
      [0, 1], [1, 0], [0, -1], [-1, 0] // Down, Right, Up, Left
    ];

    const floodFill = (start) => {
      const queue = [start];
      unused.delete(start);

      while (queue.length > 0) {
      const current = queue.shift();
      const [x, y] = current.split('').map(Number);

      for (const [dx, dy] of directions) {
        const neighbor = `${x + dx}${y + dy}`;
        if (unused.has(neighbor)) {
        unused.delete(neighbor);
        queue.push(neighbor);
        }
      }
      }
    };

    if (unused.size === 0) {
      return true;
    }

    const first = Array.from(unused)[0];
    floodFill(first);

    return unused.size === 0;
  }

  _modify(piece, x, y, turn, flip) {
    let shape = this._rotate(piece.template, turn, flip);
    piece.shape = shape;
    piece.x = x;
    piece.y = y;
    piece.turn = turn;
    piece.flip = flip;
    piece.code = piece.n + 1;
  }

  tryNext() {
    if (this.hand.size === 0) {
      return;
    }

    let count = 7 * 8 * 4 * 2;
    let p = Array.from(this.hand)[Math.floor(Math.random() * this.hand.size)];
    let n = Math.floor(Math.random() * count);

    for (var i = 0; i < count; i++) {
      if (this._tryThisOne(p, n)) {
        return;
      }
      n = (n + 1) % count;
    }

    // If no solution found, remove one, and try again
    this._tryRemove();
  }

  _tryRemove() {
    if (this.played.size > 1) {
      let q = Array.from(this.played)[Math.floor(Math.random() * this.played.size)];
      this.played.delete(q);
      this.hand.add(q);
      let piece = this.pieces[q];
      this._remove(piece.shape, [piece.x, piece.y]);
    }
  }

  _tryThisOne(p, n) {
    let piece = this.pieces[p];
    let x = n % 7;
    let y = Math.floor(n / 7) % 8;
    let turn = Math.floor(n / (7 * 8)) % 4;
    let flip = Math.floor(n / (7 * 8 * 4)) % 2;

    this._modify(piece, x, y, turn, flip);

    if (this._allUnused(piece)) {
      this.hand.delete(p);
      this.played.add(p);
      this._place(piece.shape, [piece.x, piece.y], piece.code);

      let copy = new Set(this.unused);
      if (this._noIslands(copy)) {
        return true;
      }

      this._remove(piece.shape, [piece.x, piece.y]);
      this.hand.add(p);
      this.played.delete(p);
    }

    return false;
  }
}
