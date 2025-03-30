export default class DrawCard {
  constructor(iris) {
    this.iris = iris;
    this.context = iris.context;
    this.critters = [];
    this.speed = 0.2;
    this.scale = 0.6;
  }

  getSprites(time, dt) {
    let target = this.iris.mode.towns.board.countUsed() * 2 + 1;

    if (this.critters.length < target) {
      this.critters.push(this._makeCritter());
    }

    let list = [];
    this.critters.forEach(critter => {
      let done = this._update(critter, dt);
      if (done) {
        this.critters = this.critters.filter(c => c !== critter);
      }
      let world = this._toWorld(critter.position);
      let name = 'critter' + String(critter.type).padStart(2, '0');
      list.push([name, {
        scale: this.scale,
        hflip: critter.hflip,
        position: world,
      }]);

      //this._debugDraw(critter.position, 'red');
      //this._debugDraw(critter.target, 'lime');
    });
    return list;
  }

  _makeCritter() {
    let side = Math.floor(Math.random() * 2);
    let x = side ? -0.5 : 4.5;
    let y = Math.floor(Math.random() * 5);
    let delta = [side ? 1 : -1, 0];
    let c = {
      position: [x, y],
      type: Math.floor(Math.random() * 11),
      speed: this.speed + Math.random() * 0.2 - 0.1,
      delta: delta,
    };
    this._setTarget(c);
    return c;
  }

  _update(critter, dt) {
    let x = critter.position[0] + critter.delta[0] * critter.speed * dt;
    let y = critter.position[1] + critter.delta[1] * critter.speed * dt;

    // reached target?
    if (critter.delta[0]) {
      // horizontal
      var reached;
      if (critter.delta[0] < 0) {
        reached |= (x <= critter.target[0]);
      } else {
        reached |= (x >= critter.target[0]);
      }
      if (reached) {
        x = critter.target[0];
        critter.delta[0] = 0;
        critter.delta[1] = critter.target[1] > y ? 1 : -1;
        critter.position = [x, y];
        this._setTarget(critter);
      }
    } else {
      // vertical
      var reached;
      if (critter.delta[1] < 0) {
        reached |= (y <= critter.target[1]);
      } else {
        reached |= (y >= critter.target[1]);
      }
      if (reached) {
        y = critter.target[1];
        critter.delta[1] = 0;
        critter.delta[0] = critter.target[0] > x ? 1 : -1;
        critter.position = [x, y];
        this._setTarget(critter);
      }
      critter.position = [x, y];
    }

    critter.position = [x, y];
    //this._setTarget(critter);

    critter.hflip = critter.delta[0] < 0;

    if (x < -0.5 || x > 4.5) {
      // out of bounds
      return true;
    }
  }

  _setTarget(critter) {
    //find a target point ahead, not on the same row/column
    let x = critter.position[0] + critter.delta[0] * 0.2;
    let y = critter.position[1] + critter.delta[1] * 0.2;
    let tx, ty;
    if (critter.delta[0]) {
      // horizontal
      ty = Math.floor(Math.random() * 4);
      if (ty >= y) ty++;
      if (critter.delta[0] < 0) {
        // left
        tx = Math.floor(Math.random() * x);
      }
      else {
        // right
        tx = Math.ceil(Math.random() * (4 - x) + x)
      }
    } else {
      // vertical
      tx = Math.floor(Math.random() * 4);
      if (tx >= x) tx++;
      if (critter.delta[1] < 0) {
        // up
        ty = Math.floor(Math.random() * y);
      }
      else {
        // down
        ty = Math.ceil(Math.random() * (4 - y) + y)
      }
    }
    critter.target = [tx, ty]

  }

  _toWorld(grid) {
    const top = 144;
    const left = 12;
    const w = 106;
    const h = 80;
    return [grid[0] * w + left, grid[1] * h + top];
  }

  _debugDraw(grid, color = 'white') {
    let w = this._toWorld(grid);
    this.context.fillStyle = color;
    this.context.beginPath();
    this.context.arc(w[0], w[1], 6, 0, Math.PI * 2);
    this.context.fill();
  }
}