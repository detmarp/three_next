import Drawer from '../draw2/drawer.js';
import Stater from '../draw2/stater.js';
import FitCanvas from '../d/fitcanvas.js';

export default class Binary {
  constructor(canvas) {
    this.canvas = canvas;
  }

  setup() {
    this.context = this.canvas.getContext("2d");
    this.frame = 0;
    this.fitcanvas = new FitCanvas(this.canvas, 400);
    this.drawer = new Drawer(this.canvas);
    this.stater = new Stater(this.canvas);
  }

  start() {
  }

  resize() {
    this.fitcanvas.resize();
  }

  work() {
    this.frame++;
  }

  do(x, y, on) {
    this.stater.push();
    if (on) {
      this.stater.set({
        shadow: {
          color: '#ff8800',
          blur: 10,
        }
      });
    }
    this.drawer.drawShape(
      {
        radius: 20,
        position: [330 - x * 50, 140 + y * 50],
        fill: on ? '#ff2222' : '#220000',
        line: on ? '#ff6600' : '#886622',
      }
    );
    this.stater.pop();
  }

  draw() {
    this.context.fillStyle = '#222222';
    this.context.fillRect(0, 0, this.fitcanvas.size, this.fitcanvas.size);

    let [h, m, s] = this.clock();

    this.do(0, 0, h & 1);
    this.do(1, 0, h & 2);
    this.do(2, 0, h & 4);
    this.do(3, 0, h & 8);
    this.do(4, 0, h & 16);

    this.do(0, 1, m & 1);
    this.do(1, 1, m & 2);
    this.do(2, 1, m & 4);
    this.do(3, 1, m & 8);
    this.do(4, 1, m & 16);
    this.do(5, 1, m & 32);

    this.do(0, 2, s & 1);
    this.do(1, 2, s & 2);
    this.do(2, 2, s & 4);
    this.do(3, 2, s & 8);
    this.do(4, 2, s & 16);
    this.do(5, 2, s & 32);
  }

  font(size) {
    // return a font string
    return `${size}px monospace`;
  }

  clock() {
    let date = new Date();
    let h = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    return [h, m, s];
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
