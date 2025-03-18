import Helly from './helly.js';
import Areas from './areas.js';
import GameMode from './gamemode.js';
import Settings from './settings.js';

export default class Iris {
  constructor() {
  }

  load1(callback) {
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

    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    this._reset();

    let title = this.addText(`Tiny Towns`, [(450 - 320)/2, 5, 320, 40]);
    title.style.fontFamily = 'Lilita One';
    title.style.textAlign = 'center';
    title.style.color = 'brown';
    title.style.backgroundColor = '#f5f5dc';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'center';
    title.style.borderRadius = '6px';

/*
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 2; x++) {
        let i = y * 2 + x;
        this.addText(`card ${i}`, [x * 72 + 5, y * 60 + 48, 64, 54]);
      }
    }
    this.addText('card', [153, 48, 144, 240]);
    this.addText('resources', [153 + 144 + 4, 48, 144, 240]);
    this.addText('game', [5, 292, 218, 144]);
    this.addText('score', [226, 292, 220, 144]);
*/
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
    textElement.style.border = '1px solid yellow';
    textElement.style.color = 'lime';
    textElement.style.display = 'flex';
    textElement.style.boxSizing = 'border-box';
    textElement.style.textAlign = 'left';
    textElement.style.alignItems = 'flex-start';
    textElement.style.justifyContent = 'flex-start';
    textElement.style.whiteSpace = 'normal';
    textElement.style.overflowWrap = 'break-word';
    textElement.textContent = text;
    textElement.style.pointerEvents = 'none';

    this.textElements.push(textElement);

    return textElement;
  }

  windowToDiv(screen) {
    const rect = this.canvas.getBoundingClientRect();
    let x, y;

    x = ((screen[0]) / rect.width) * this.canvas.width;
    y = ((screen[1]) / rect.height) * this.canvas.height;

    //console.log(`${screen} -> ${x}, ${y}`);
    return [x, y];
  }

  render(dt) {
    this.textElements.forEach(textElement => {
      textElement.style.fontSize = textElement.offsetWidth / 10 + 'px';
    });

    this.mode.render(dt);

    this.areas._debugDraw(this.context);
  }
}
