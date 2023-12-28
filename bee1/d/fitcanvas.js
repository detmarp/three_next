export default class FitCanvas {
  constructor(canvas, size) {
    this.canvas = canvas;
    this.size = size;
    this.context = this.canvas.getContext("2d");
  }

  resize() {
    this.canvas.style.width ='100%';
    this.canvas.style.height='100%';
    this.canvas.width = this.canvas.offsetWidth;  // set the internal size to match
    this.canvas.height = this.canvas.offsetHeight;

    let width = Math.max(this.canvas.width, 40);
    let height = Math.max(this.canvas.height, 40);
    let min = Math.min(width, height);
    let scale = min / this.size;
    this.context.scale(scale, scale);
  }
}
