export default class Drawer {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
  }

  drawShape(shape) {
    let r = shape.radius ?? 16;;
    let [x, y] = shape.position ?? [0, 0];
    let fill = shape.fill ?? (shape.line ? null : '#ff00ff');

    this.context.beginPath();
    this.context.arc(x, y, r, 0, 2 * Math.PI);
    if (fill) {
      this.context.fillStyle = fill;
      this.context.fill();
    }
    if (shape.line) {
      this.context.strokeStyle = shape.line;
      this.context.stroke();
    }
  }
}
