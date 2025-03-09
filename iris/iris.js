export default class Iris {
  constructor(context) {
    // Expects a 450 x 800 context
    this.context = context;
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
