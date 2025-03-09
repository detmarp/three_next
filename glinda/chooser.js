import Sprite from './sprite.js';

export default class Chooser {
  constructor(glinda) {
    this.glinda = glinda;
    this.types = {
      none: 0,
      dirt: 1,
      grass: 2,
      tree: 3,
    };
  }

  _rand(n) {
    return Math.floor(Math.random() * n);
  }

  choose(x, y) {
    let weights = this._getNeighbors(x, y);
    weights[0] = 0;
    for (let i = 1; i < weights.length; i++) {
      weights[i] = weights[i] * 20 + 1;
    }
    let choice = this._pickWeighted(weights);
    //console.log(`${weights}  ${choice}`);

    var tile = {}
    tile.x = x;
    tile.y = y;
    tile.map = [x, y];
    tile.layer = [];

    if (choice === this.types.dirt) {
      tile.layer[0] = {
        source: this._rand(2),
        foobar: this._fromList(['dirt0', 'dirt1']),
      };
      tile.type = this.types.dirt;
    }
    else if (choice === this.types.grass) {
      tile.layer = [
        {
          source: this._rand(2) ,
        foobar: this._fromList(['dirt0', 'dirt1']),
      },
        {
          source: this._rand(3) + 2 ,
        foobar: this._fromList(['grass0', 'grass1', 'grass2']),
      },
        ];
      tile.type = this.types.grass;
    }
    else {
      tile.layer = [
        {
          source: this._rand(2) ,
        foobar: this._fromList(['dirt0', 'dirt1']),
      },
        {
          source: this._rand(3) + 2 ,
        foobar: this._fromList(['grass0', 'grass1', 'grass2']),
      },
        ];
      let xx = this._rand(2);
      let x = 1024 * xx;
      tile.layer[2] = {
        //sprite: new Sprite(this.glinda.tiles, [x + 256, 256], [256, 256], [128, 128]),
        foobar: ['treeashadow', 'treebshadow'][xx],
      };
      tile.layer[3] = {
        //sprite: new Sprite(this.glinda.tiles, [x, 256], [256, 256], [128, 128]),
        foobar: ['treea', 'treeb'][xx],
      };
      tile.type = this.types.tree;
    }

    return tile;
  }

  _fromList(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  _pickWeighted(weights) {
    let sum = weights.reduce((a, b) => a + b, 0);
    let r = Math.random() * sum;
    for (let i = 0; i < weights.length; i++) {
      r -= weights[i];
      if (r <= 0) {
        return i;
      }
    }
    return weights.length - 1;
  }

  _toKey(x, y) {
    return `${x},${y}`;
  }

  _getNeighbors(x, y) {
    const neighbors = [0, 0, 0, 0];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) {
          continue;
        }
        let key = this._toKey(x + i, y + j);
        let value = this.glinda.world.map.has(key) ? this.glinda.world.map.get(key) : null;
        let type = value ? value.type : 0;
        neighbors[type]++;
      }
    }
    return neighbors;
  }
}
