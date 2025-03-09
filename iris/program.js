import Iris from './iris.js';

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.glinda = null;
    this.lastFrameTime = null;

    this.colors = {
      gradientStart: '#0e2c42', // Dark Blue
      gradientEnd: '#4a5298', // Light Blue
      boundsBackground: '#d3d3e3', // Light Metallic Gray
      canvasBackground: '#003366' // Dark Blue
    };
  }

  run() {
    this.setDOM();
    this.iris = new Iris(this.context);

    window.addEventListener('resize', () => this.onResize());

    this.onResize();
    this.doFrame();
  }

  setDOM() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    // Create a radial gradient background with a larger center color area
    const gradient = document.createElement('div');
    gradient.style.position = 'absolute';
    gradient.style.top = '0';
    gradient.style.left = '0';
    gradient.style.width = '100%';
    gradient.style.height = '100%';
    gradient.style.background = `radial-gradient(circle at center, ${this.colors.gradientStart} 50%, ${this.colors.gradientEnd} 100%)`;
    this.container.appendChild(gradient);

    this.boundsMargin = 2;

    this.bounds = document.createElement('div');
    this.bounds.style.position = 'absolute';
    this.bounds.style.top = `${this.boundsMargin}px`;
    this.bounds.style.left = `${this.boundsMargin}px`;
    this.bounds.style.right = `${this.boundsMargin}px`;
    this.bounds.style.bottom = `${this.boundsMargin}px`;
    this.bounds.style.backgroundColor = this.colors.boundsBackground;
    this.container.appendChild(this.bounds);

    this.setCanvas();
  }

  setCanvas() {
    this.bounds.innerHTML = '';
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.bounds.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');
    this.time = 0;
    this.scale = 1;
    this.offset = [-1, -1];
    this.onResize();
  }

  onResize() {
    const aspectRatio = 9 / 16;
    const targetWidth = 450;
    const targetHeight = 800;
    const margin = this.boundsMargin * 2;
    const containerWidth = window.innerWidth - margin;
    const containerHeight = window.innerHeight - margin;
    let canvasWidth, canvasHeight;

    if (containerWidth / containerHeight > aspectRatio) {
      canvasHeight = containerHeight - margin;
      canvasWidth = canvasHeight * aspectRatio;
    } else {
      canvasWidth = containerWidth - margin;
      canvasHeight = canvasWidth / aspectRatio;
    }

    const scale = Math.min(containerWidth / targetWidth, containerHeight / targetHeight);

    this.canvas.width = targetWidth;
    this.canvas.height = targetHeight;
    this.canvas.style.width = `${targetWidth * scale}px`;
    this.canvas.style.height = `${targetHeight * scale}px`;
    this.canvas.style.top = '50%';
    this.canvas.style.left = '50%';
    this.canvas.style.transform = 'translate(-50%, -50%)';

    this.bounds.style.width = `${targetWidth * scale + margin}px`;
    this.bounds.style.height = `${targetHeight * scale + margin}px`;
    this.bounds.style.top = '50%';
    this.bounds.style.left = '50%';
    this.bounds.style.transform = 'translate(-50%, -50%)';
  }

  doFrame() {
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

      const saveTransform = this.context.getTransform();
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.fillStyle = this.colors.canvasBackground;
      this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.setTransform(saveTransform);

      this.iris.render(dt);
    }

    requestAnimationFrame(() => this.doFrame());
  }
}