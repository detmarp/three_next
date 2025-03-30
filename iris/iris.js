import Helly from './helly.js';
import Areas from './areas.js';
import GameMode from './gamemode.js';
import Settings from './settings.js';

export default class Iris {
  constructor() {
    this.time = 0;
    this.dt = 1/60;
  }

  load1(callback) {
    // load step called by Program
    this.settings = new Settings();
    this.settings.load(() => {
      if (callback) {
        callback();
      }
    });
  }

  init(context) {
    this.context = context;
    this.textElements = [];

    this.canvas = context.canvas;
    this.bottomDiv = document.createElement('div');
    this.bottomDiv.style.position = 'absolute';
    this.bottomDiv.style.top = `0px`;
    this.bottomDiv.style.left = `0px`;
    this.bottomDiv.style.width = '100%';
    this.bottomDiv.style.height = '100%';
    this.bottomDiv.style.pointerEvents = 'none';
    this.canvas.parentNode.appendChild(this.bottomDiv);

    this.areas = new Areas(this);

    //const link = document.createElement('link');
    //link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    //link.rel = 'stylesheet';
    //document.head.appendChild(link);

    this._reset();

    //let title = this.addText(`Tiny Towns`, [(450 - 320)/2, 5, 320, 40]);
    //title.style.fontFamily = 'Lilita One';
    //title.style.textAlign = 'center';
    //title.style.color = 'brown';
    //title.style.backgroundColor = '#f5f5dc';
    //title.style.display = 'flex';
    //title.style.alignItems = 'center';
    //title.style.justifyContent = 'center';
    //title.style.borderRadius = '6px';

    this.helly = new Helly(this.context);
    this.helly.load('data/contents.json');

    this.mode = new GameMode(this);
  }

  _reset() {
    while (this.bottomDiv.firstChild) {
      this.bottomDiv.removeChild(this.bottomDiv.firstChild);
    }
    this.textElements = [];
  }

  addText(text, bounds) {
    const [x, y, w, h] = bounds;
    const textElement = document.createElement('div');
    this.bottomDiv.appendChild(textElement);

    textElement.style.position = 'absolute';
    textElement.style.top = `${(y / 800) * 100}%`;
    textElement.style.left = `${(x / 450) * 100}%`;
    textElement.style.width = `${(w / 450) * 100}%`;
    textElement.style.height = `${(h / 800) * 100}%`;
    textElement.style.overflow = 'hidden';
    textElement.style.textOverflow = 'ellipsis';
    //textElement.style.border = '1px solid yellow';
    textElement.style.color = '#222222';
    textElement.style.display = 'flex';
    textElement.style.boxSizing = 'border-box';
    textElement.style.textAlign = 'left';
    textElement.style.alignItems = 'flex-start';
    textElement.style.justifyContent = 'flex-start';
    textElement.style.whiteSpace = 'normal';
    textElement.style.overflowWrap = 'break-word';
    textElement.innerHTML = text;
    textElement.style.pointerEvents = 'none';

    this.textElements.push(textElement);

    return textElement;
  }

  windowToDiv(screen) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;
    x = ((screen[0]) / rect.width) * this.canvas.width;
    y = ((screen[1]) / rect.height) * this.canvas.height;
    return [x, y];
  }

  render(time, dt) {
    this.time = time;
    this.dt = dt;

    // Reset drawing settings
    this.context.lineWidth = 1;
    this.context.strokeStyle = '#000';
    this.context.fillStyle = '#000';
    this.context.setLineDash([]);
    this.context.globalAlpha = 1.0;
    this.context.font = '10px sans-serif';

    this._fillBackground();

    this.textElements.forEach(textElement => {
      textElement.style.fontSize = textElement.offsetWidth / 11 + 'px';
    });
    this.mode.render(time, dt);
    this.areas._debugDraw(this.context);
  }

  _fillBackground() {
    this.colors = {
      top: '#bc831c',
      gradient1a: '#3570b7',
      gradient1b: '#a2dded',
      gradient2a: '#e5ebf0',
      gradient2b: '#eef',
    };
    const y0 = 40
    const y1 = 165;

    const gradient0 = this.context.createLinearGradient(0, 0, 0, y1);
    gradient0.addColorStop(0, this.colors.gradient1a);
    gradient0.addColorStop(1, this.colors.gradient1b);
    this.context.fillStyle = gradient0;
    this.context.fillRect(0, 0, this.canvas.width, y1);

    this.context.fillStyle = this.colors.top;
    this.context.fillRect(0, 0, this.canvas.width / 2, y0);

    const gradient1 = this.context.createLinearGradient(0, y1, 0, this.canvas.height);
    gradient1.addColorStop(0, this.colors.gradient2a);
    gradient1.addColorStop(1, this.colors.gradient2b);
    this.context.fillStyle = gradient1;
    this.context.fillRect(0, y1, this.canvas.width, this.canvas.height - y1);
  }
}
