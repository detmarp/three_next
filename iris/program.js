import Iris from './iris.js';
import GameLoop from './gameloop.js';

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;

    this.colors = {
      gradientStart: '#6e6c62',
      gradientEnd: '#bab2b8',
      boundsBackground: '#d3d3e3',
      canvasBackground: '#bbaa66'
    };
  }

  load() {
    this.iris = new Iris();
    this._showLoading1();

    this.iris.load1(() => {
      this.load2();
    });
  }

  load2() {
    this.run();
  }

  _showLoading1() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }
    const message = document.createElement('div');
    message.style.position = 'absolute';
    message.style.top = '50%';
    message.style.left = '50%';
    message.style.transform = 'translate(-50%, -50%)';
    message.style.color = '#222222';
    message.style.fontFamily = 'sans-serif';
    message.style.backgroundColor = '#eeeeee';
    message.style.width = '100%';
    message.style.height = '100%';
    message.style.display = 'flex';
    message.style.justifyContent = 'center';
    message.style.alignItems = 'center';
    message.innerText = 'Loading...';
    this.container.appendChild(message);
  }

  run() {
    this.setDOM();
    this.iris.init(this.context);

    window.addEventListener('resize', () => this.onResize());

    this.onResize();

    this.gameLoop = new GameLoop(dt => {
      this._doFrame(dt);
    });
    this.gameLoop.run();
  }

  setDOM() {
    while (this.container.firstChild) {
      this.container.removeChild(this.container.firstChild);
    }

    const gradient = document.createElement('div');
    gradient.style.position = 'absolute';
    gradient.style.top = '0';
    gradient.style.left = '0';
    gradient.style.width = '100%';
    gradient.style.height = '100%';
    gradient.style.background = `radial-gradient(circle at center, ${this.colors.gradientStart} 50%, ${this.colors.gradientEnd} 100%)`;
    this.container.appendChild(gradient);

    this.boundsMargin = 0;

    this.bounds = document.createElement('div');
    this.bounds.style.position = 'absolute';
    this.bounds.style.top = `${this.boundsMargin}px`;
    this.bounds.style.left = `${this.boundsMargin}px`;
    this.bounds.style.right = `${this.boundsMargin}px`;
    this.bounds.style.bottom = `${this.boundsMargin}px`;
    //this.bounds.style.backgroundColor = this.colors.boundsBackground;
    this.container.appendChild(this.bounds);

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

  _doFrame(dt) {
    const saveTransform = this.context.getTransform();
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.fillStyle = this.colors.canvasBackground;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.setTransform(saveTransform);

    this.iris.render(dt);
  }
}