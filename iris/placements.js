// Find when buildings can be placed
export default class Placement {
  constructor(iris, towns) {
    this.iris = iris;
    this.towns = towns;
    this.context = iris.context;

    this.period = 0.5;
    this.duty = 0.8;

    this.groups = [];
  }

  find() {
    this.groups = [];
    const resources = {
      glass: 'c',
      stone: 'g',
      wheat: 'y',
      wood: 'b',
      brick: 'r',
    };
    let board = [['', '', '', ''], ['', '', '', ''], ['', '', '', ''], ['', '', '', '']];
    for (let tile of this.towns.board.tiles) {
      board[tile.y][tile.x] = resources[tile.resource] ?? ' ';
    }
    let hand = [];
    for (let item of this.towns.hand) {
      hand.push(item.card);
    }
    let i = 0;
    for (let card of hand) {
      let shape = card.shape.map(row => row.split(''));
      this._findRotations(board, shape, tiles => {
        this.groups.push({
          tiles: tiles,
          building: card.building,
          card_index: i,
        })
      });
      i++;
    }
  }

  _findRotations(board, shape, onMatch) {
    for (var turn = 0; turn < 4; turn++) {
      this._findShape(board, shape, onMatch);
      shape = shape[0].map((_, colIndex) => shape.map(row => row[colIndex]).reverse());
    }
  }

  _findShape(board, shape, onMatch) {
    let bw = board[0].length;
    let bh = board.length;
    let sw = shape[0].length;
    let sh = shape.length;
    for (let y = 0; y <= bh - sh; y++) {
      for (let x = 0; x <= bw - sw; x++) {
        let matches = true;
        let tiles = [];
        for (let sy = 0; sy < sh; sy++) {
          for (let sx = 0; sx < sw; sx++) {
            if (shape[sy][sx] !== '-' && shape[sy][sx] !== board[y + sy][x + sx]) {
              matches = false;
              break;
            }
            if (shape[sy][sx] !== '-') {
              tiles.push((y + sy) * bw + (x + sx));
            }
          }
          if (!matches) break;
        }
        if (matches) {
          onMatch(tiles);
        }
      }
    }
    return null;
}

  draw(time, dt) {
    let count = this.groups.length;
    if (count === 0) {
      return;
    }
    let i = time / this.period % count;
    let j = Math.floor(i);
    let phase = Math.max(Math.min(i % 1, 1), 0);
    let group = this.groups[j];
    for (let tile of group.tiles) {
      const bounds = this.iris.mode.layout.tiles[tile].bounds;
      const position = this.iris.mode._center(bounds);
      this._drawMarker(position, phase);
    }
    let c = group.card_index;
    let bounds = this.iris.mode.layout.cards[c].bounds;
    let center = this.iris.mode._center(bounds);
    this._drawMarker(center, phase);
    //building.draw(this.context, center);

    for (let i = 0; i < count; i++) {
      this._drawMarker(i, phase);
    }
  }

  _drawMarker(position, phase) {
    const pulse = Math.sin(phase * Math.PI);
    const radius = 20 + 10 * pulse;
    this.context.beginPath();
    this.context.arc(position[0], position[1], radius, 0, Math.PI * 2);
    this.context.fillStyle = `rgba(0, 255, 0, ${0.5 + 0.5 * pulse})`; // Pulsing opacity
    this.context.fill();
    this.context.closePath();
  }
}
