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
    const width = 64;
    const height = 48;
    const canvasHeight = this.context.canvas.height;

    const adjustedY = canvasHeight - y - height;

    this.context.fillStyle = 'cyan';
    this.context.fillRect(x, y, width, height);
  }
}