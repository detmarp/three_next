export class Program {
  constructor(canvas) {
    this.canvas = canvas;
  }

  setup() {
    this.context = this.canvas.getContext("2d");
    this.frame = 0;
    this.size = 400;
  }

  start() {
  }

  resize() {
    let width = Math.max(window.innerWidth, 40);
    let height = Math.max(window.innerHeight, 40);
    let min = Math.min(width, height);
    this.canvas.width  = width;
    this.canvas.height = height;
    let scale = min / this.size;
    this.context.scale(scale, scale);
  }

  work() {
    this.frame++;
  }

  draw() {
    this.context.fillStyle = '#eeeeee';
    this.context.fillRect(0, 0, this.size, this.size);

    let [time, fraction] = this.clock();
    let margin = this.size * 0.84;
    let baseline = 150;

    this.context.font = this.font(70);
    this.context.textAlign = 'right';
    this.context.verticalAlign = 'baseline';
    this.context.fillStyle = '#222222';
    this.context.fillText(time, margin, baseline);

    this.context.font = this.font(40);
    this.context.textAlign = 'left';
    this.context.fillStyle = '#333333';
    this.context.fillText(fraction, margin, baseline);
  }

  font(size) {
    // return a font string
    return `${size}px monospace`;
  }

  clock() {
    // return the time as array: [time, fraction]
    let date = new Date();
    let h = date.getHours().toString().padStart(2, '0');
    let m = date.getMinutes().toString().padStart(2, '0');
    let s = date.getSeconds().toString().padStart(2, '0');
    let f = Math.floor(date.getMilliseconds() / 10).toString().padStart(2, '0');
    let time = `${h}:${m}:${s}`;
    let fraction = `${f}`;
    return [time, fraction];
  }

   update() {
    this.resize();
    this.work();
    this.draw();
    requestAnimationFrame(() => {this.update();});
  }

   run() {
    this.setup();
    this.start();
    this.update();
  }
}
