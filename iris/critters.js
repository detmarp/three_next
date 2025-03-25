export default class DrawCard {
  constructor(iris) {
    this.iris = iris;
    this.context = iris.context;
    this.critters = [];
    this.speed = 0.4;
  }

  render(time, dt) {
    let target = this.iris.mode.towns.board.countUsed() + 1;

    if (this.critters.length < target) {
      this.critters.push(this._makeCritter());
    }

    this.critters.forEach(critter => {
      let done = this._update(critter, dt);
      if (done) {
        this.critters = this.critters.filter(c => c !== critter);
      }
      let world = this._toWorld(critter.position);
      this.iris.helly.draw('critter' + critter.type, world);
    });
  }

  _makeCritter() {
    let side = Math.floor(Math.random() * 2);
    let x = side ? -0.5 : 4.5;
    let y = Math.floor(Math.random() * 5);
    let delta = [side ? 1 : -1, 0];
    let c = {
      position: [x, y],
      type: Math.floor(Math.random() * 7),
      speed: this.speed + Math.random() * 0.2 - 0.1,
      delta: delta,
    };
    return c;
  }

  _update(critter, dt) {
    let x = critter.position[0] + critter.delta[0] * critter.speed * dt;
    let y = critter.position[1] + critter.delta[1] * critter.speed * dt;
    critter.position = [x, y];
    if (x < -0.5 || x > 4.5) {
      return true;
    }
  }

  _toWorld(grid) {
    const top = 204;
    const left = 12;
    const w = 106;
    const h = 80;
    return [grid[0] * w + left, grid[1] * h + top];
  }
}