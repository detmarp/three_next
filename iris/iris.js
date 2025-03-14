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

    this.areas = new Areas(this);

    this._addText('score', 10, 10, 300, 200);
    this._addText('resources', 320, 10, 120, 200);
    for (let i = 0; i < 7; i++) {
      this._addText(`card ${i}`, i * 60 + 10, 220, 54, 72);
    }
    this._addText('info', 10, 300, 430, 50);
    this._addText('town', 10, 360, 430, 430);

    this.areas.add([10, 300, 200, 200]);
    this.areas.add([10, 360, 430, 430]);

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

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const cellX = col * cellSize;
        const cellY = row * cellSize;

        this.context.strokeStyle = 'red';
        this.context.lineWidth = 1;
        this.context.strokeRect(cellX, cellY, cellSize, cellSize);
      }
    }

    this.helly.draw('board', [5, 455]);
    this.helly.draw('building00', [5 + 440 * 1/8, 455 + 330 * 1/8]);
    this.helly.draw('building01', [5 + 440 * 3/8, 455 + 330 * 3/8]);
    this.helly.draw('resource00', [5 + 440 * 5/8, 455 + 330 * 3/8]);
    this.helly.draw('resource01', [5 + 440 * 3/8, 455 + 330 * 5/8]);
    this.helly.draw('resource01', [5 + 440 * 5/8, 455 + 330 * 5/8]);
    this.helly.draw('card00', [15, 15]);

    this.areas._debugDraw(this.context);
  }
}
