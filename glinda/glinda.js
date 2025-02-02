import World from './world.js';

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

    // Initialize the world
    this.world = new World(this);
  }

  handleTouch(event) {
    // Handle touch input
  }

  render(dt) {
    this.positionCamera();

    const canvas = this.context.canvas;
    this._junkMakeWorld();

    this.world.sorted.forEach((key) => {
      const tile = this.world.map.get(key);
      this.drawTile(tile, tile.map);
    });

    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        let position = [x * this.grid.size[0], y * this.grid.size[1]];
        let size = [this.grid.size[0], this.grid.size[1]];
        //this.debugDrawAxis(position, size);
      }
    }

    this.time += dt;
  }

  positionCamera() {
    let phase = (2 * Math.PI * this.time) / 40;
    let distance = 3.0 + 0.5 * Math.sin(phase);
    let scale = 1 / distance;
    this.camera.scale = scale;
    this.camera.center = [128*4, 96*4];
    this.camera.center = [0, 0];
    //this.camera.center = [this.time * 20, this.time * 30];

    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let x = centerX - this.camera.center[0] * scale;
    let y = centerY - this.camera.center[1] * scale;
    this.context.setTransform(scale, 0, 0, scale, x, y);
  }

  _junkMakeWorld() {
    var xMin = -10;
    var xMax = 10;
    var yMin = -10;
    var yMax = 10;
    let changed = false;
    for (var x = xMin; x <= xMax; x++) {
      for (var y = yMin; y <= yMax; y++) {
        changed |= this.world.add(x, y);
      }
    }
    if (changed) {
      this.world.sort();
    }
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
      const color = tile.color || 'magenta';
      this.context.fillStyle = color;

      let image = (this.tiles.complete && tile.source !== undefined);

      if (image) {
        var srcX = tile.source * 256;
        var srcY = 0;
        var destX = 0 - 64;
        var destY = -128+96 - 48;
        var w = 256;
        var h = 256;
        this.context.drawImage(this.tiles, srcX, srcY, w, h, destX, destY, w, h);
      } else {
        this.context.beginPath();
        // draw diamond, from left, to top, to right, to bottom, and back
        this.context.moveTo(0, this.halfH);
        this.context.lineTo(this.halfW, 0);
        this.context.lineTo(this.width, this.halfH);
        this.context.lineTo(this.halfW, this.height);
        this.context.closePath();
        this.context.fill();
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

  gridToCanvas(g) {
    return [g[0] * this.width, g[1] * this.height];
  }

  mapToGrid(m) {
    return [(m[0] - m[1]) / 2, (-m[0] - m[1]) / 2];
  }
}