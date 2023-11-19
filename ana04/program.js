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

    let hands = this.clock();

    this.context.strokeStyle = '#222222';
    this.context.beginPath();
    let r = this.size * 0.48;
    this.context.arc(this.size / 2, this.size / 2, r, 0, 2 * Math.PI);
    this.context.stroke();

    this.drawHand(hands[2], 0.90, '#bb2222'); // second
    this.drawHand(hands[0], 0.60, '#222222'); // hour
    this.drawHand(hands[1], 0.80, '#222222'); // minute
    this.drawHand(hands[3], 0.95, '#2222ee'); // fraction
  }

  drawHand(degrees, size, color) {
    let r = this.size * 0.48 * size;
    let cx = this.size / 2;
    let cy = this.size / 2;
    let cos = Math.cos((degrees - 90) * Math.PI / 180);
    let sin = Math.sin((degrees - 90) * Math.PI / 180);
    let x = cx + r * cos;
    let y = cy + r * sin;

    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.moveTo(cx, cy);
    this.context.lineTo(x, y);
    this.context.stroke();
  }

  font(size) {
    // return a font string
    return `${size}px monospace`;
  }

  clock() {
    // return the clock hands angles time as array: [time, fraction]
    let date = new Date();
    let f = date.getMilliseconds();
    let s = date.getSeconds()
    let m = date.getMinutes()
    let h = date.getHours()
    return [
      ((h % 12) + m / 60 + s / 3600)* 360 / 12,
      (m + (s + f / 1000) / 60 ) * 360 / 60,
      s * 360 / 60,
      f * 360 / 1000
    ];
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
