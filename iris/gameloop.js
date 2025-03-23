export default class Gameloop {
  constructor(update) {
    this.update = update;
    this.lastFrameTime = null;
    this.time = 0;
    this.frame = 0;
  }

  run() {
    this._doFrame();
  }

  _doFrame() {
    const currentTime = performance.now();
    let dt = 0;
    if (this.lastFrameTime === null) {
      dt = 1 / 60;
    } else {
      dt = (currentTime - this.lastFrameTime) / 1000;
    }

    if (dt > 0.008) {
      dt = Math.min(dt, 0.1);
      this.lastFrameTime = currentTime;
      this.time += dt;
      this.frame++;
      this.update(this.time, dt);
    }

    requestAnimationFrame(() => this._doFrame());
  }
}