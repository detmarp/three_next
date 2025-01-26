export default class Glinda {
  constructor(context) {
    this.context = context;
    this.halfW = 64;
    this.halfH = 48;
    this.width = this.halfW * 2;
    this.height = this.halfH * 2;
    this.tileSize = [this.width, this.height];
    this.bg = 'forestgreen';
  }

  handleTouch(event) {
    // Handle touch input
  }

  render(dt) {
    const canvas = this.context.canvas;
    this.context.fillStyle = this.bg;
    this.context.fillRect(0, 0, canvas.width, canvas.height);

    var world = this._junkMakeWorld();
    world.forEach((tile, _) => {
      this.drawTile(tile, tile.map);
    });
  }

  _junkMakeWorld() {
    const world = new Map();
    var topLeft = this.canvasToMap([0, 0]);
    var topRight = this.canvasToMap([this.context.canvas.width, 0]);
    var bottomRight = this.canvasToMap([this.context.canvas.width, this.context.canvas.height]);
    var bottomLeft = this.canvasToMap([0, this.context.canvas.height]);
    var xMin = Math.min(topLeft[0], topRight[0], bottomRight[0], bottomLeft[0]) + 2;
    var xMax = Math.max(topLeft[0], topRight[0], bottomRight[0], bottomLeft[0]) - 2;
    var yMin = Math.min(topLeft[1], topRight[1], bottomRight[1], bottomLeft[1]) + 2;
    var yMax = Math.max(topLeft[1], topRight[1], bottomRight[1], bottomLeft[1]) - 2;
    for (var x = xMin; x <= xMax; x++) {
      for (var y = yMin; y <= yMax; y++) {
        world.set(`tile${x},${y}`, { map: [x, y], color: this.randomColor() });
      }
    }
    return world;
  }

  drawAt(c, callback) {
    const prevTransform = this.context.getTransform();
    this.context.translate(c[0], c[1]);
    callback();
    this.context.setTransform(prevTransform);
  }

  drawTile(tile, map) {
    const c = this.gridToCanvas(this.mapToGrid(map));
    this.drawAt([c[0] - this.halfW, c[1] - this.halfH], () => {
      const color = tile.color || this.randomColor();//'magenta';
      this.context.fillStyle = color;

      this.context.beginPath();
      // draw diamond, from left, to top, to right, to bottom, and back
      this.context.moveTo(0, this.halfH);
      this.context.lineTo(this.halfW, 0);
      this.context.lineTo(this.width, this.halfH);
      this.context.lineTo(this.halfW, this.height);
      this.context.closePath();
      this.context.fill();
      });
  }

  canvasToGrid(c) {
    return [c[0] / this.width, c[1] / this.height];
  }

  gridToCanvas(g) {
    return [g[0] * this.width, g[1] * this.height];
  }

  canvasToMap(c) {
    return this.gridToMap(this.canvasToGrid(c));
  }

  gridToMap(g) {
    return [g[0] - g[1], -g[0] - g[1]];
  }

  mapToGrid(m) {
    return [(m[0] - m[1]) / 2, (-m[0] - m[1]) / 2];
  }

  randomColor() {
    const rand = (n) => Math.floor(Math.random() * n);
    const hex = () => rand(256).toString(16).padStart(2, '0');
    const insert = (a, b, n) => a.slice(0, n) + b + a.slice(n);
    const rgb = insert(rand(2) ? '#ff00' : '#00ff', hex(), rand(3) * 2 + 1);
    return rgb;
  }
}