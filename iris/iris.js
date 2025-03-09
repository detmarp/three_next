export default class Iris {
  constructor(context) {
    this.context = context;
  }

  render(dt) {
    const radius = 100;
    const x = 0;
    const y = 0;

    // Flip the color state bit
    this.isBlack = !this.isBlack;
      this.context.fillStyle = this.isBlack ? 'black' : 'white';

    this.context.beginPath();
    this.context.arc(x, y, radius, 0, Math.PI * 2);
    this.context.fill();
  }
}
