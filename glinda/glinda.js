import World from './world.js';
import Sprite from './sprite.js';
import Camera from './camera.js';

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
    this.camera = new Camera(context);
    this.cameraX = {
      center: [0, 0],
      scale: 1.0
    };
    this.time = 0;
    this.dt = 1/60;

    this.loaded = false;
    this._loadStuff();
    this.world = new World(this);

    this.positionCamera();
  }

  updateCameraTransform() {
    this.camera.update(this.dt);

    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    let scale2 = this.camera.scale * (this.camera.debug ? 2 : 1);

    this.topLeft = [this.camera.center[0] - centerX / scale2, this.camera.center[1] - centerY / scale2];
    this.bottomRight = [this.camera.center[0] + centerX / scale2, this.camera.center[1] + centerY / scale2];

    this.gridTL = this.canvasToGrid(this.topLeft);
    this.gridBR = this.canvasToGrid(this.bottomRight);

    let pad = 1;
    this.gridTL = [this.gridTL[0] - pad, this.gridTL[1] - pad];
    this.gridBR = [this.gridBR[0] + pad, this.gridBR[1] + pad];
  }

  render(dt) {
    this.dt = dt;
    this.updateCameraTransform();

    this.time += dt;
    const canvas = this.context.canvas;

    if (!this.loaded) { return; }

    this._junkMakeWorld();

    this.world.draw_world();

    if (this.camera.debug) {
      this.camera.debug_draw();
    }

    this.world.sorted.forEach((key) => {
      const tile = this.world.map.get(key);
      //this.drawTile(tile, tile.map);
    });

    let remove = new Set();
    this.world.map.forEach((tile, key) => {
      if (!this.isMapVisible(tile.map)) {
        remove.add(key);
      }
    });
    for (let key of remove) {
      this.world.remove(key);
    }
    this.world.sort();
  }

  _loadStuff() {
    // Load the image
    this.tiles = new Image();
    this.tiles.src = 'glinda_tile_00.png';
    this.tiles.onload = () => {
      console.log('Image loaded');

      fetch('glinda_tile_00.json')
      .then(response => response.json())
      .then(data => {
        this.json = data;
        console.log('JSON loaded');

        this.tree = new Sprite(this.tiles, [1024, 256], [256, 256], [128, 128]);

        this.loaded = true;
      })
      .catch(error => {
        console.error('Error loading JSON:', error);
      });
    };
  }

  positionCamera() {
    let phase = (2 * Math.PI * this.time) / 30;
    let distance = 2.5 + 2.0 * Math.sin(phase);
    let scale = 1 / distance;
    this.cameraX.scale = scale;
    this.cameraX.center = [128*4, 96*4];
    this.cameraX.center = [0, 0];
    this.cameraX.center = [this.time * 40, this.time * -60];

    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let x = centerX - this.cameraX.center[0] * scale;
    let y = centerY - this.cameraX.center[1] * scale;
    //this.context.setTransform(scale, 0, 0, scale, x, y);

    let scale2 = scale * 1;
    this.topLeft = [this.cameraX.center[0] - centerX / scale2, this.cameraX.center[1] - centerY / scale2];
    this.bottomRight = [this.cameraX.center[0] + centerX / scale2, this.cameraX.center[1] + centerY / scale2];

    this.gridTL = this.canvasToGrid(this.topLeft);
    this.gridBR = this.canvasToGrid(this.bottomRight);

    let pad = 1;
    this.gridTL = [this.gridTL[0] - pad, this.gridTL[1] - pad];
    this.gridBR = [this.gridBR[0] + pad, this.gridBR[1] + pad];
  }

  _junkMakeWorld() {
    var xMin = this.gridTL[0];
    var xMax = this.gridBR[0];
    var yMin = this.gridTL[1];
    var yMax = this.gridBR[1];
    for (var x = xMin; x <= xMax; x++) {
      for (var y = yMin; y <= yMax; y++) {
        var m = this.gridToMap([x, y]);
        this.world.add(m[0], m[1]);
      }
    }
    this.world.sort();
  }

  nearestMap(point) {
    var gx = Math.round(point[0] / this.grid.size[0]/2);
    var gy = Math.round(point[1] / this.grid.size[1]/2);
    if ((Math.abs(gx) + Math.abs(gy)) % 2 == 1) {
      gx++;
    }
    let m = this.gridToMap([gx, gy]);
    return m;
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

      var srcX = tile.source * 256;
      var srcY = 0;
      var destX = 0 - 64;
      var destY = -128+96 - 48;
      var w = 256;
      var h = 256;
      this.context.drawImage(this.tiles, srcX, srcY, w, h, destX, destY, w, h);
    });

    this.tree.draw(this.context, [c[0] -0, c[1] -0]);
  }

  debugDrawAxis(position, size) {
    this.drawAt(position, () => {
      this.context.strokeStyle = 'white';
      this.context.lineWidth = 1;
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.lineTo(size[0], 0);
      this.context.moveTo(0, 0);
      this.context.lineTo(0, size[1]);
      this.context.stroke();
    });
  }

  isMapVisible(map, pad = 1) {
    let grid = this.mapToGrid(map);
    if (grid[0] < this.gridTL[0] - pad || grid[0] > this.gridBR[0] + pad) {
      return false;
    }
    if (grid[1] < this.gridTL[1] - pad || grid[1] > this.gridBR[1] + pad) {
      return false;
    }
    return true;
  }

  gridToCanvas(g) {
    return [g[0] * this.grid.size[0], g[1] * this.grid.size[1]];
  }

  canvasToGrid(c) {
    return [ Math.round(c[0] / this.grid.size[0]), Math.round(c[1] / this.grid.size[1])];
  }

  mapToGrid(m) {
    return [(m[0] - m[1]), (-m[0] - m[1])];
  }

  gridToMap(g) {
    let g0 = g[0];
    if ((Math.abs(g0) + Math.abs(g[1])) % 2 == 1) {
      g0++;
    }
    return [(g0 - g[1])/2, (-g0 - g[1])/2];
  }
}
