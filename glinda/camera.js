import Mytouch from './mytouch.js';

export default class Camera {
  constructor(context) {
    this.context = context;
    this.initEventListeners();
  }

  initEventListeners() {
    this.mytouch = new Mytouch(this.context.canvas);
  }

  debug_draw() {
    const prevTransform = this.context.getTransform();

    if (this.mytouch.count > 0) {
      const colors = ['red', 'orange', 'yellow', 'green', 'blue'];
      const color = colors[Math.min(this.mytouch.count - 1, colors.length - 1)];
      this.context.strokeStyle = color;
      const size = 0.05 * Math.max(this.context.canvas.width, this.context.canvas.height);
      this.context.setTransform(1, 0, 0, 1, 0, 0);
      this.context.translate(100, 120);
      this.context.beginPath();
      this.context.arc(0, 0, size, 0, 2 * Math.PI, false);
      this.context.lineWidth = 10;
      this.context.stroke();
    }

    this.context.setTransform(prevTransform);
  }
}
