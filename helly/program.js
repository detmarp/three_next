import Helly from './helly.js';

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.lastFrameTime = 0;
  }

  run() {
    this.setCanvas();
    this.onResize();

    window.addEventListener('resize', () => this.onResize());

    this.doFrame();
  }

  setCanvas() {
    this.container.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.color = 'midnightblue';

    this.helly = new Helly(this.context);
    this.helly.addEventListener('loadingdone', () => this.onLoadingDone());
    this.helly.loadImage('data/tile00.png');
    this.helly.loadJson('data/tile00.json');
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  doFrame(timestamp = 0) {
    const dt = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;

    this.helly.startFrame(dt);

    this.context.fillStyle = this.color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let pass = 0; pass < 2; pass++) {
      let x = 0;
      for (const key of this.helly.sprites.keys()) {
        let a = x % 6;
        let b = Math.floor(x / 6);
        let grid = [(1 + a) * 2 + b, b + 3];
        let world = this._gridToWorld(grid);
        let name = (pass === 0) ? 'dirt0' : key;
        this.helly.draw(name, world);
        x++;
      }
    }

    this.helly.draw('riverstr', this._gridToWorld([2, 8]));
    this.helly.draw('riverstr2', this._gridToWorld([4, 8]));

    requestAnimationFrame((timestamp) => this.doFrame(timestamp));
  }

  _gridToWorld(grid) {
    return [grid[0] * 64, grid[1] * 48];
  }

  onLoadingDone() {
    console.log('All assets loaded');
  }
}