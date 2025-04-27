export default class TownsBoard {
  constructor() {
    this._clear();
  }

  _clear() {
    this.tiles = new Array(16).fill(null).map(() => ({}));
    for (let i = 0; i < 16; i++) {
      this.tiles[i].id = i;
      this.tiles[i].x = i % 4;
      this.tiles[i].y = Math.floor(i / 4);
    }
  }

  countUsed() {
    return this.count(tile => tile.building || tile.resource);
  }

  count(predicate) {
    return this.tiles.filter(predicate).length;
  }

  static fromObject(obj) {
    let board = new TownsBoard();
    for (let i = 0; i < obj.length; i++) {
      let tile = board.tiles[i];
      for (let name of obj[i]) {
        if (['wheat', 'brick', 'wood', 'glass', 'stone'].includes(name)) {
          tile.resource = name;
        } else {
          tile.building = name;
        }
      }
    }
    return board;
  }
}