export default class World {
  constructor(glinda) {
    this.glinda = glinda;
    this.map = new Map();
    this.sorted = [];
    this.dirty = true;
  }

  add(x, y) {
    const key = this._toKey(x, y);
    if (!this.map.has(key)) {
      this.map.set(key, this._newTile(x, y));
      this.dirty = true;
    }
  }

  remove(key) {
    if (this.map.has(key)) {
      this.map.delete(key);
      this.dirty = true;
    }
  }

  sort() {
      if (this.dirty) {
      this.sorted = Array.from(this.map.keys()).sort((a, b) => {
        var aa = this.map.get(a);
        var bb = this.map.get(b);
        if (aa.y === bb.y) {
          return bb.x - aa.x;
        }
        return bb.y - aa.y;
        }
      );
      this.dirty = false;
    }
  }

  _toKey(x, y) {
    return `${x},${y}`;
  }

  _newTile(x, y) {
    const rand = (n) => Math.floor(Math.random() * n);
    var tile = {}
    tile.x = x;
    tile.y = y;
    tile.map = [x, y];
    tile.color = this._randomColor();
    if (rand(4) === 0) {
      tile.source = rand(2);
    }
    else {
      tile.source = rand(2) + 2;
    }
    return tile;
  }

  _randomColor() {
    const rand = (n) => Math.floor(Math.random() * n);
    const hex = () => rand(256).toString(16).padStart(2, '0');
    const insert = (a, b, n) => a.slice(0, n) + b + a.slice(n);
    const rgb = insert(rand(2) ? '#ff00' : '#00ff', hex(), rand(3) * 2 + 1);
    return rgb;
  }
}