export default class World {
  constructor(glinda) {
    this.glinda = glinda;
    this.map = {};
  }

  add(x, y) {
    const key = this._toKey(x, y);
    if (!this.map[key]) {
      this.map[key] = this._newTile(x, y);
    }
  }

  remove(x, y) {
    const key = this._toKey(x, y);
    if (this.map[key]) {
      delete this.map[key];
    }
  }

  _toKey(x, y) {
    return `${x},${y}`;
  }

  _newTile(x, y) {
    const rand = (n) => Math.floor(Math.random() * n);
    var tile = {}
    tile.map = [x, y];
    tile.color = this.randomColor();
    tile.source = rand(2) + 1;
    return tile;
  }
}