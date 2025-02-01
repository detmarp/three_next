import Glinda from './glinda.js';

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.glinda = null;
    this.lastFrameTime = null;
    this.origin = [0, 0];
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
    this.time = 0;
    this.scale = 1;
    this.offset = [-1, -1];
  }

  onResize() {
    this.canvas.width = window.innerWidth - 20;
    this.canvas.height = window.innerHeight - 20;
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
    let dt = 0;
    if (this.lastFrameTime !== null) {
      dt = (currentTime - this.lastFrameTime) / 1000;
    }
    this.lastFrameTime = currentTime;
    this.time += dt;

    const saveTransform = this.context.getTransform();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = '#225511';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.setTransform(saveTransform);

    this.glinda.render(dt);

    requestAnimationFrame(() => this.doFrame());
  }
}