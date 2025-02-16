import Helly from './helly.js';

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.squareSize = 100;
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

  doFrame() {
    this.frameCount = (this.frameCount || 0) + 1;

    this.context.fillStyle = this.color;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    let x = 128;
    for (const key of this.helly.sprites.keys()) {
      console.log(key);
      this.helly.draw(key, [x, 128]);
      x += 64;
    }

    requestAnimationFrame(() => this.doFrame());
  }

  onLoadingDone() {
    console.log('All assets loaded');
  }
}