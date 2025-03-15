import Helly from './helly.js';
import Areas from './areas.js';

export default class Iris {
  constructor(context) {
    this.context = context;
    this.textElements = []; // List to store text elements

    this.canvas = context.canvas;
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = `0px`;
    overlayDiv.style.left = `0px`;
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    overlayDiv.style.pointerEvents = 'none';
    this.canvas.parentNode.appendChild(overlayDiv);

    let color1 = '#dcdcdc';
    let color2 = '#a9a9a9';
    //overlayDiv.style.background = `linear-gradient(135deg, ${color1}, ${color2})`

    this.areas = new Areas(this);

    let title = this._addText(`Tiny Towns`, (450 - 320)/2, 5, 320, 40);
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    title.style.fontFamily = 'Lilita One';
    title.style.textAlign = 'center';
    title.style.color = 'brown';
    title.style.backgroundColor = '#f5f5dc';
    title.style.display = 'flex';
    title.style.alignItems = 'center';
    title.style.justifyContent = 'center';

    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 2; x++) {
        let i = y * 2 + x;
        this._addText(`card ${i}`, x * 72 + 5, y * 60 + 48, 64, 54);
      }
    }
    this._addText('card', 153, 48, 144, 240);
    this._addText('resources', 153 + 144 + 4, 48, 144, 240);
    this._addText('game', 5, 292, 218, 144);
    this._addText('score', 226, 292, 220, 144);

    this.helly = new Helly(this.context);
    this.helly.load('data/contents.json');
  }

  _addText(text, x, y, w, h) {
    const overlayDiv = this.canvas.parentNode.querySelector('div');
    const textElement = document.createElement('div');
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
    overlayDiv.appendChild(textElement);

    return textElement;
  }

  render(dt) {
    this.textElements.forEach(textElement => {
      textElement.style.fontSize = textElement.offsetWidth / 10 + 'px';
    });

    const radius = 100;
    const x = 0;
    const y = 0;

    const cellSize = 50;
    const cols = 8;
    const rows = 15;

    // for (let row = 0; row < rows; row++) {
    //   for (let col = 0; col < cols; col++) {
    //     const cellX = col * cellSize;
    //     const cellY = row * cellSize;

    //     this.context.strokeStyle = 'red';
    //     this.context.lineWidth = 1;
    //     this.context.strokeRect(cellX, cellY, cellSize, cellSize);
    //   }
    // }

    this.helly.draw('board', [5, 455]);
    this.helly.draw('building00', [5 + 440 * 1/8, 455 + 330 * 1/8]);
    this.helly.draw('building01', [5 + 440 * 3/8, 455 + 330 * 3/8]);
    this.helly.draw('resource00', [5 + 440 * 5/8, 455 + 330 * 3/8]);
    this.helly.draw('resource01', [5 + 440 * 3/8, 455 + 330 * 5/8]);
    this.helly.draw('resource01', [5 + 440 * 5/8, 455 + 330 * 5/8]);
    this.helly.draw('card00', [153, 48]);

    this.areas._debugDraw(this.context);
  }
}
