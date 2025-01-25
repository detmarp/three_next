export default class Glinda {
  constructor(context) {
    this.context = context;
    this.halfW = 64;
    this.halfH = 48;
    this.width = this.halfW * 2;
    this.height = this.halfH * 2;
  }

  handleTouch(event) {
    // Handle touch input
  }

  draw(dt) {
    const canvas = this.context.canvas;

    // Clear the canvas to white
    this.context.fillStyle = this.randomColor();//'white';
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a square with size based on dt
    const size = dt * 10000;
    this.context.fillStyle = this.randomColor();//'blue';
    this.context.fillRect(0, 0, size, size);

    for (let mx = 0; mx < 7; mx++) {
      for (let my = 0; my < 7; my++) {
        this.drawMap(mx, my, {});
      }
    }

    this.drawPixel(0, 0, {})
    this.drawPixel(100, 100, {})
  }

  drawMap(x, y, tile) {
    // Draw tile at map position
    let c = x % 2 + (y % 2) * 2;
    const colors = ['red', 'orange', 'yellow', 'green'];
    tile.color = this.randomColor();//colors[c % colors.length];

    let gx = x - y;
    let gy = -x -y;
    this.drawGrid(gx, gy, tile);
  }

  drawGrid(x, y, tile) {
    // Draw tile at grid position
    const canvas = this.context.canvas;

    const cx = Math.floor(canvas.width / 2);
    const cy = Math.floor(canvas.height / 2);

    let px = x * this.halfW + cx;
    let py = y * this.halfH + cy;
    this.drawPixel(px, py, tile);
  }

  randomColor() {
    const rand = (n) => Math.floor(Math.random() * n);
    const hex = () => rand(256).toString(16).padStart(2, '0');
    const insert = (a, b, n) => a.slice(0, n) + b + a.slice(n);
    const rgb = insert(rand(2) ? '#ff00' : '#00ff', hex(), rand(3) * 2 + 1);
    return rgb;
  }

  drawPixel(x, y, tile) {
    // Draw tile at pixel, top left anchor
    const saveSmooth = this.context.imageSmoothingEnabled;
    this.context.imageSmoothingEnabled = false;

    const color = tile.color || this.randomColor();//'magenta';
    this.context.fillStyle = color;

    this.context.beginPath();
    this.context.moveTo(x - this.halfW, y);
    this.context.lineTo(x, y - this.halfH);
    this.context.lineTo(x + this.halfW, y);
    this.context.lineTo(x, y + this.halfH);
    this.context.closePath();
    this.context.fill();

    this.context.imageSmoothingEnabled = saveSmooth;
  }
}