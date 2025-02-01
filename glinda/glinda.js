export default class Glinda {
  constructor(context) {
    this.context = context;
    this.halfW = 64;
    this.halfH = 48;
    this.width = this.halfW * 2;
    this.height = this.halfH * 2;
    this.tileSize = [this.width, this.height];
    this.grid = {
      size: [64, 48]
    };
    this.camera = {
      center: [0, 0],
      zoom: 1.0
    };
    this.time = 0;

    // Load the image
    this.tiles = new Image();
    this.tiles.src = 'glinda_tile_00.png';
    this.tiles.onload = () => {
      console.log('Image loaded');
    };
  }

  handleTouch(event) {
    // Handle touch input
  }

  render(dt) {
    this.positionCamera();

    const canvas = this.context.canvas;
    var world = this._junkMakeWorld();
    world.forEach((tile, _) => {
      this.drawTile(tile, tile.map);
    });

    if (this.tiles.complete) {
      var destX = 0;
      var destY = -128+96;
      var destWidth = 256;
      var destHeight = 256;
      this.context.drawImage(this.tiles, 256, 0, 256, 256, destX, destY, destWidth, destHeight);
      destX = 128;
      destY = -128+96;
      destWidth = 256;
      destHeight = 256;
      this.context.drawImage(this.tiles, 512, 0, 256, 256, destX, destY, destWidth, destHeight);
    }
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
      this.debugDrawAxis(
        [x * this.grid.size[0], y * this.grid.size[1]],
        [this.grid.size[0], this.grid.size[1]]
      );
      }
    }

    this.time += dt;
  }

  positionCamera() {
    let phase = (2 * Math.PI * this.time) / 40;
    let scale = 1.0 + 0.25 * Math.sin(phase);
    this.camera.zoom = scale;
    this.camera.center = [128*4, 96*4];
    //this.camera.center = [this.time * 20, this.time * 30];

    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let x = centerX - this.camera.center[0] * scale;
    let y = centerY - this.camera.center[1] * scale;
    this.context.setTransform(scale, 0, 0, scale, x, y);
  }

  _junkMakeWorld() {
    const world = new Map();
    var topLeft = this.canvasToMap([0, 0]);
    var topRight = this.canvasToMap([this.context.canvas.width, 0]);
    var bottomRight = this.canvasToMap([this.context.canvas.width, this.context.canvas.height]);
    var bottomLeft = this.canvasToMap([0, this.context.canvas.height]);

//    var topRight = [topLeft[0] + 3, topLeft[1]];
//    var bottomRight = [topLeft[0] + 3, topLeft[1] + 3];
//    var bottomLeft = [topLeft[0], topLeft[1] + 3];

    var xMin = Math.floor(Math.min(topLeft[0], topRight[0], bottomRight[0], bottomLeft[0]) + 2);
    var xMax = Math.floor(Math.max(topLeft[0], topRight[0], bottomRight[0], bottomLeft[0]) - 2);
    var yMin = Math.floor(Math.min(topLeft[1], topRight[1], bottomRight[1], bottomLeft[1]) + 2);
    var yMax = Math.floor(Math.max(topLeft[1], topRight[1], bottomRight[1], bottomLeft[1]) - 2);
    const rand = (n) => Math.floor(Math.random() * n);
    for (var x = xMin; x <= xMax; x++) {
      for (var y = yMin; y <= yMax; y++) {
        var tile = {}
        tile.map = [x, y];
        tile.color = this.randomColor();
        tile.source = rand(2) + 1;
        world.set(`tile${x},${y}`, tile);
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
      const color = tile.color || this.randomColor();
      this.context.fillStyle = color;

      this.context.beginPath();
      // draw diamond, from left, to top, to right, to bottom, and back
      this.context.moveTo(0, this.halfH);
      this.context.lineTo(this.halfW, 0);
      this.context.lineTo(this.width, this.halfH);
      this.context.lineTo(this.halfW, this.height);
      this.context.closePath();
      //this.context.fill();

      if (this.tiles.complete && tile.source !== undefined) {
        var srcX = tile.source * 256;
        var srcY = 0;
        var destX = 0;
        var destY = -128+96;
        var w = 256;
        var h = 256;
        this.context.drawImage(this.tiles, srcX, srcY, w, h, destX, destY, w, h);
        //this.context.drawImage(this.tiles, tile.source * 256, 0, 256, 256, destX, destY, destWidth, destHeight);
      }
    }
    );
  }

  debugDrawAxis(position, size) {
    this.drawAt(position, () => {
      this.context.strokeStyle = 'magenta';
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(size[0], 0);
      this.context.moveTo(0, 0);
      this.context.lineTo(0, size[1]);
      this.context.stroke();
    });
  }

  debugDrawGrid(position) {
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