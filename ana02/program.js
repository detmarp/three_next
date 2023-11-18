export class Program {
  constructor() {
  }

  setup() {
    this.canvas = document.getElementById("canvas");
    this.frame = 0;
    this.time = 0;
    this.count = 0;
    this.width = 100;
    this.height = 100;
  }

  start() {
    this.canvas.onclick = () => { this.onclick(); };
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    const context = this.canvas.getContext("2d");
    context.canvas.width  = this.width;
    context.canvas.height = this.height;
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
    let color = (this.count & 1 ) ? 'rgb(100,155,0)' : 'rgb(0,100,0)';
    const context = this.canvas.getContext("2d");
    context.rect(0, 0, this.width, this.height);
    context.fillStyle = color;
    context.fill();

    context.fillStyle = (this.frame & 4) ? 'rgb(0,0,255)': 'rgb(255,0,0)';
    context.fillRect(10, 10, 20, 20);
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
