export default class Iris {
  constructor(context) {
    // Expects a 450 x 800 context
    this.context = context;

    // Add a sibling element to the canvas
    const canvas = context.canvas;
    const xxxDiv = document.createElement('div');
    xxxDiv.style.position = 'absolute';
    xxxDiv.style.top = '0';
    xxxDiv.style.left = '0';
    xxxDiv.style.width = '100%';
    xxxDiv.style.height = '100%';
    xxxDiv.id = 'one';

    canvas.parentNode.appendChild(xxxDiv);
    const overlayDiv = document.createElement('div');
    overlayDiv.style.position = 'absolute';
    overlayDiv.style.top = `0px`;
    overlayDiv.style.left = `0px`;
    overlayDiv.style.width = '100%';
    overlayDiv.style.height = '100%';
    canvas.parentNode.appendChild(overlayDiv);
    const textNode = document.createTextNode('Twas brillig, and the slithy toves'
    +'Did gyre and gimble in the wabe;'
    +'All mimsy were the borogoves,'
    +'And the mome raths outgrabe.');
    overlayDiv.appendChild(textNode);

    this._addText('Hello, world!', 0, 0, 200, 200);
    this._addText('bottom<br>right', 350, 700, 100, 100);
  }

  _addText(text, x, y, w, h) {
    const overlayDiv = this.context.canvas.parentNode.querySelector('div');
    const textElement = document.createElement('div');
    textElement.style.position = 'absolute';
    textElement.style.top = `${(y / 800) * 100}%`;
    textElement.style.left = `${(x / 450) * 100}%`;
    textElement.style.width = `${(w / 450) * 100}%`;
    textElement.style.height = `${(h / 800) * 100}%`;
    textElement.style.overflow = 'hidden';
    textElement.style.whiteSpace = 'nowrap';
    textElement.style.textOverflow = 'ellipsis';
    textElement.style.fontSize = 'calc(10px + 1vw)'; // Adjust font size relative to viewport width
    textElement.style.border = '1px solid yellow'; // Add yellow single pixel border
    textElement.style.color = 'lime'; // Set text color to lime green
    textElement.style.display = 'flex';
    textElement.style.alignItems = 'center';
    textElement.style.justifyContent = 'center';
    textElement.style.boxSizing = 'border-box'; // Include padding and border in the element's total width and height
    textElement.textContent = text;
    overlayDiv.appendChild(textElement);
  }

  render(dt) {
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
    // Flip the color state bit
    this.isBlack = !this.isBlack;
      this.context.fillStyle = this.isBlack ? 'black' : 'white';

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
  }
}
