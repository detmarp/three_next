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
}