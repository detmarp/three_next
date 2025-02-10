import Sprite from './sprite.js';

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

  drawAt(c, callback) {
    const prevTransform = this.glinda.context.getTransform();
    this.glinda.context.translate(c[0], c[1]);
    callback();
    this.glinda.context.setTransform(prevTransform);
  }

  draw_world() {
    this.sort();

  //});

    this._draw_ground(0);
    this._draw_ground(1);
    this._draw_ground(2, 0.2);
    this._draw_billboard(3);
  }

  _draw_ground(index, alpha = 1.0) {
    this.sorted.forEach((key) => {
      const tile = this.map.get(key);
      const c = this.glinda.gridToCanvas(this.glinda.mapToGrid(tile.map));
      //this.drawAt([c[0] - this.glinda.halfW, c[1] - this.glinda.halfH], () => {
        let layer = tile.layer[index];
        if (layer && layer.source !== undefined) {
          var srcX = layer.source * 256;
          var srcY = 0;
          var destX = c[0] - this.glinda.halfW + 0 - 64;
          var destY = c[1] - this.glinda.halfH + -128+96 - 48;
          var w = 256;
          var h = 256;
          this.glinda.context.drawImage(this.glinda.tiles, srcX, srcY, w, h, destX, destY, w, h);
        }
    });
  }

  _draw_billboard(index) {
    this.sorted.forEach((key) => {
      const tile = this.map.get(key);
      const c = this.glinda.gridToCanvas(this.glinda.mapToGrid(tile.map));
      //this.drawAt([c[0] - this.glinda.halfW, c[1] - this.glinda.halfH], () => {
        let layer = tile.layer[index];
        if (layer && layer.source !== undefined) {
          var srcX = layer.source * 256;
          var srcY = 0;
          var destX = c[0] - this.glinda.halfW + 0 - 64;
          var destY = c[1] - this.glinda.halfH + -128+96 - 48;
          var w = 256;
          var h = 256;
          this.glinda.context.drawImage(this.glinda.tiles, srcX, srcY, w, h, destX, destY, w, h);
        }
        if (layer && layer.sprite) {
          layer.sprite.draw(this.glinda.context, [c[0] -0, c[1] -0]);
        }
    });
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
    tile.layer = [];
    tile.layer[0] = {
      source: rand(2),
    };
    if (rand(3) === 0) {
      tile.layer[1] = {
        source: rand(3) + 2
      };
    }
    if (rand(4) === 0) {
      tile.layer[3] = {
        sprite: new Sprite(this.glinda.tiles, [1024 * rand(2), 256], [256, 256], [128, 128]),
      };
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