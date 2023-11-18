export class Program {
  constructor(canvas) {
    this.canvas = canvas;
  }

  setup() {
    this.context = this.canvas.getContext("2d");
    this.frame = 0;
    this.time = 0;
    this.size = 400;
  }

  start() {
    this.canvas.onclick = () => { this.onclick(); };
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
    var now = new Date().getTime(); // In epoch ms.
    this.time = now;
    this.frame++;
  }

  onclick() {
    this.count++;
  }

  draw() {
    let color = '#eeeeee';
    //context.rect(0, 0, this.width, this.height);
    this.context.fillStyle = color;
    this.context.fill();

    let size = Math.min(this.width, this.height);
    this.context.fillStyle = (this.frame & 4) ? 'rgb(0,0,255)': 'rgb(0, 0, 200)';
    //context.fillRect(x, y, size, size);

    this.context.lineWidth = 1;
    this.context.strokeStyle = '#ff0000';
    let x = this.size - 1;
    this.context.strokeRect(0.5, 0.5, x, x);

    this.context.font = "48px serif";
    this.context.fillText("Hello world", 10, 50);
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
