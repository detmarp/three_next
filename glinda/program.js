import Glinda from './glinda.js';

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.glinda = null;
    this.lastFrameTime = null;
  }

  run() {
    this.setCanvas();
    this.glinda = new Glinda(this.context);

    window.addEventListener('resize', () => this.onResize());
    this.addTouchListeners();

    this.onResize();
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
  }

  onResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  addTouchListeners() {
    this.canvas.addEventListener('touchstart', (event) => this.handleTouch(event));
    this.canvas.addEventListener('touchmove', (event) => this.handleTouch(event));
    this.canvas.addEventListener('touchend', (event) => this.handleTouch(event));
  }

  handleTouch(event) {
    this.glinda.handleTouch(event);
  }

  doFrame() {
    const currentTime = performance.now();
    let deltaTime = 0;
    if (this.lastFrameTime !== null) {
      deltaTime = (currentTime - this.lastFrameTime) / 1000;
    }
    this.lastFrameTime = currentTime;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.glinda.render(deltaTime);
    requestAnimationFrame(() => this.doFrame());
  }
}