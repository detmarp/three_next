export default class Glinda {
  constructor(context) {
    this.context = context;
  }

  handleTouch(event) {
    // Handle touch input
  }

  draw(dt) {
    const canvas = this.context.canvas;

    // Clear the canvas to white
    this.context.fillStyle = 'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a square with size based on dt
    const size = dt * 10000;
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, size, size);

    const x = Math.floor(canvas.width / 2);
    const y = Math.floor(canvas.height / 2);
    this.drawTile(x, y, {});
  }

  drawTile(x, y, tile) {
    const width = 128;
    const height = 96;
    let wHalf = Math.floor(width / 2);
    let hHalf = Math.floor(height / 2);
    let x2 = x - wHalf;
    let y2 = y - hHalf;

    this.context.fillStyle = 'cyan';
    this.context.fillRect(x2, y2, width, height);
  }
}