export default class SecondsLeft {
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

  work() {
    this.frame++;
  }

  draw() {
    this.context.fillStyle = '#222222';
    this.context.fillRect(0, 0, this.size, this.size);

    let [time, fraction] = this.clock();
    let margin = this.size * 0.78;
    let baseline = 210;

    let ctx = this.context;
    ctx.shadowColor = '#ff2222';
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    ctx.shadowBlur = 20;

    this.context.font = this.font(90);
    this.context.textAlign = 'right';
    this.context.verticalAlign = 'baseline';
    this.context.fillStyle = '#ff7700';
    this.context.fillText(time, margin, baseline);


    this.context.font = this.font(45);
    this.context.textAlign = 'left';
    this.context.fillStyle = '#ff7700';
    this.context.fillText(fraction, margin, baseline);
  }

  font(size) {
    // return a font string
    return `${size}px monospace`;
  }

  clock() {
    // return the time as array: [time, fraction]
    let date = new Date();
    let totalSeconds =
      date.getHours() * 3600 +
      date.getMinutes() * 60 +
      date.getSeconds() +
      date.getMilliseconds() / 1000;
    let totalLeft = 86400 - totalSeconds;

    let s = Math.floor(totalLeft).toString().padStart(5, '0');
    let f = Math.floor((totalLeft - s) * 100).toString().padStart(2, '0');

    let time = `${s}`;
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
