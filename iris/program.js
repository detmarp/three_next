import Iris from './iris.js';
import GameLoop from './gameloop.js';
import MyLoader from './myloader.js';
import ScreenHome from './screenhome.js';
import ScreenEditor from './screeneditor.js';
import ScreenSettings from './screensettings.js';
import ScreenNewGame from './screennewgame.js';
import Towns from './towns.js';

// Pass in a top level container. We expect this to be the full screen.
// Sets up a top-level this.bounds element
// Gives it a canvas child
// and a overlay child

export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;

    this.colors = {
      gradientStart: '#666',
      gradientEnd: '#bbb',
      boundsBackground: '#d3d3e3',
      canvasBackground: '#a63'
    };
  }

  load() {
    this.setDOM();

    this.iris = new Iris(this, this.context);

    let myLoader = new MyLoader();
    myLoader.begin(() => {
      this.iris.load1();
      myLoader.end();
    });

    myLoader.waitForAll(() => {
      this.run();
    });
  }

  run() {
    window.addEventListener('resize', () => this.onResize());
    this.onResize();
    this.gameLoop = new GameLoop((time, dt) => {
      this._doFrame(time, dt);
    });

    this.goto('home');
    this.gameLoop.run();
  }

  goto(mode, data) {
    this.canvas.innerHTML = '';
    this.overlay.innerHTML = '';

    let isTextOverlay = false;
    switch (mode) {
      case 'game':
        {
          if (data) {
            this.towns = Towns.create(data);
          }
          else {
            this.towns = new Towns();
          }
          this.iris.init(this.towns);
          this.screen = this.iris;
        }
        break;
      case 'settings':
        this.screen = new ScreenSettings(this);
        isTextOverlay = true;
        break;
      case 'newgame':
        this.screen = new ScreenNewGame(this);
        isTextOverlay = true;
        break;
      case 'editor':
        this.screen = new ScreenEditor(this);
        isTextOverlay = true;
        break;
      case 'quickstart':
        {
          let towns = this.towns = new Towns();
          this.iris.init(towns);
          this.screen = this.iris;
        }
        break;
      default:
        // home
        this.screen = new ScreenHome(this);
        isTextOverlay = true;
    }

    this.iris.settings.save();

    if (isTextOverlay) {
      this.iris.areas.clear();
      this.makeOverlayInputFriendly(this.overlay);
    }
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
    this.container.appendChild(this.bounds);

    this.bounds.innerHTML = '';

    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.className = 'iris-canvas';
    this.bounds.appendChild(this.canvas);
    this.context = this.canvas.getContext('2d');

    this.overlay = document.createElement('div');
    this.overlay.style.position = 'absolute';
    this.overlay.style.top = '0';
    this.overlay.style.left = '0';
    this.overlay.style.width = '100%';
    this.overlay.style.height = '100%';
    this.overlay.className = 'iris-overlay';
    this.overlay.style.pointerEvents = 'none';
    this.bounds.appendChild(this.overlay);

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

    this.overlay.style.width = `${targetWidth * scale}px`;
    this.overlay.style.height = `${targetHeight * scale}px`;
    this.overlay.style.top = '50%';
    this.overlay.style.left = '50%';
    this.overlay.style.transform = 'translate(-50%, -50%)';

    this.bounds.style.width = `${targetWidth * scale + margin}px`;
    this.bounds.style.height = `${targetHeight * scale + margin}px`;
    this.bounds.style.top = '50%';
    this.bounds.style.left = '50%';
    this.bounds.style.transform = 'translate(-50%, -50%)';
  }

  _doFrame(time, dt) {
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.screen.render(time, dt);
  }

  makeOverlayInputFriendly(overlayEl) {
    // Make the overlay ignore all pointer events...
    overlayEl.style.pointerEvents = 'none';

    // ...except for interactive children
    const allowTags = ['BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'LABEL'];
    allowTags.forEach(tag => {
      const elems = overlayEl.querySelectorAll(tag);
      elems.forEach(el => {
        el.style.pointerEvents = 'auto';
      });
    });
  }

  bindGameInput(el) {
    ['touchstart', 'touchmove', 'mousedown', 'mousemove', 'pointerdown', 'pointermove'].forEach(evt => {
      el.addEventListener(evt, e => {
        const tag = e.target.tagName;
        const isUI = tag && tag.match(/BUTTON|INPUT|TEXTAREA|SELECT|LABEL/);
        if (!isUI) e.preventDefault();
      }, { passive: false });
    });
  }

}