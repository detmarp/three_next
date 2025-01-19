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
    const size = dt * 1000;
    this.context.fillStyle = 'black';
    this.context.fillRect(0, 0, size, size);
  }
}