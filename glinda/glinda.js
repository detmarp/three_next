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
    this.debug = true;
    this.time = 0;

    this.loaded = false;
    this._loadStuff();
    this.world = new World(this);

    this.positionCamera();

    // Bind event handlers
    //this.context.canvas.addEventListener('mousedown', this.handleMouse.bind(this), { passive: false });
    //this.context.canvas.addEventListener('mousemove', this.handleMouse.bind(this), { passive: false });
    //this.context.canvas.addEventListener('mouseup', this.handleMouse.bind(this), { passive: false });

    this.context.canvas.addEventListener('touchstart', this.handleTouch.bind(this), { passive: false });
    this.context.canvas.addEventListener('touchmove', this.handleTouch.bind(this), { passive: false });
    this.context.canvas.addEventListener('touchend', this.handleTouch.bind(this), { passive: false });
    this.context.canvas.addEventListener('touchcancel', this.handleTouch.bind(this), { passive: false });
  }

  handleTouch(event) {
    event.preventDefault();
  }

  handleMouse(event) {
    event.preventDefault();
    switch (event.type) {
      case 'mousedown':
        this.onMouseDown(event);
        break;
      case 'mousemove':
        this.onMouseMove(event);
        break;
      case 'mouseup':
        this.onMouseUp(event);
        break;
    }
  }

  onMouseDown(event) {
    if (event.button === 0) {
      // Handle left button (one-finger) mouse down
      this.startOneFingerTouch(event);
    } else if (event.button === 1) {
      // Handle middle button (two-finger) mouse down
      this.startTwoFingerTouch([event, this.createVirtualFinger(event)]);
    }
  }

  onMouseMove(event) {
    if (event.buttons === 1) {
      // Handle left button (one-finger) mouse move
      this.moveOneFingerTouch(event);
    } else if (event.buttons === 4) {
      // Handle middle button (two-finger) mouse move
      this.moveTwoFingerTouch([event, this.createVirtualFinger(event)]);
    }
  }

  onMouseUp(event) {
    // Handle mouse up
		event.preventDefault();
    this.endTouch();
  }

  createVirtualFinger(event) {
    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    return {
      clientX: 2 * centerX - event.clientX,
      clientY: 2 * centerY - event.clientY
    };
  }

  startOneFingerTouch(touch) {
    this.initialTouch = { x: touch.clientX, y: touch.clientY };
    this.initialCameraCenter = [...this.cameraX.center];
  }

  moveOneFingerTouch(touch) {
    const dx = touch.clientX - this.initialTouch.x;
    const dy = touch.clientY - this.initialTouch.y;
    this.cameraX.center = [
      this.initialCameraCenter[0] - dx / this.cameraX.scale,
      this.initialCameraCenter[1] - dy / this.cameraX.scale
    ];
    this.updateCameraTransform();
  }

  startTwoFingerTouch(touches) {
    this.initialTouches = [
      { x: touches[0].clientX, y: touches[0].clientY },
      { x: touches[1].clientX, y: touches[1].clientY }
    ];
    this.initialDistance = this.getDistance(this.initialTouches[0], this.initialTouches[1]);
    this.initialCameraScale = this.cameraX.scale;
  }

  moveTwoFingerTouch(touches) {
    const newTouches = [
      { x: touches[0].clientX, y: touches[0].clientY },
      { x: touches[1].clientX, y: touches[1].clientY }
    ];
    const newDistance = this.getDistance(newTouches[0], newTouches[1]);
    const scaleChange = newDistance / this.initialDistance;
    this.cameraX.scale = this.initialCameraScale * scaleChange;
    this.updateCameraTransform();
  }

  endTouch() {
    this.initialTouch = null;
    this.initialCameraCenter = null;
    this.initialTouches = null;
    this.initialDistance = null;
    this.initialCameraScale = null;
  }

  getDistance(touch1, touch2) {
    const dx = touch2.x - touch1.x;
    const dy = touch2.y - touch1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  updateCameraTransform() {
    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const x = centerX - this.cameraX.center[0] * this.cameraX.scale;
    const y = centerY - this.cameraX.center[1] * this.cameraX.scale;
    this.context.setTransform(this.cameraX.scale, 0, 0, this.cameraX.scale, x, y);

    let scale2 = this.cameraX.scale * 1;
    this.topLeft = [this.cameraX.center[0] - centerX / scale2, this.cameraX.center[1] - centerY / scale2];
    this.bottomRight = [this.cameraX.center[0] + centerX / scale2, this.cameraX.center[1] + centerY / scale2];

    this.gridTL = this.canvasToGrid(this.topLeft);
    this.gridBR = this.canvasToGrid(this.bottomRight);

    let pad = 1;
    this.gridTL = [this.gridTL[0] - pad, this.gridTL[1] - pad];
    this.gridBR = [this.gridBR[0] + pad, this.gridBR[1] + pad];
  }

  render(dt) {
    //this.positionCamera();
    this.time += dt;
    const canvas = this.context.canvas;

    if (!this.loaded) { return; }

    this._junkMakeWorld();

    this.world.draw_world();

    if (this.debug) {
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

    //this._debugShowMarkers();
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

  _debugShowMarkers() {
    console.log('World map size:', this.world.map.size);
    console.log('Top Left:', this.topLeft, 'Bottom Right:', this.bottomRight);

    this.context.beginPath();
    this.context.arc(this.topLeft[0], this.topLeft[1], 100, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'red';
    this.context.fill();

    this.context.beginPath();
    this.context.arc(this.bottomRight[0], this.bottomRight[1], 100, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'lime';
    this.context.fill();

    this.context.beginPath();
    this.context.arc(this.cameraX.center[0], this.cameraX.center[1], 50, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'white';
    this.context.fill();

    let g2 = this.canvasToGrid(this.topLeft);
    let c2 = this.gridToCanvas(g2);
    let m2 = this.gridToMap(g2);
    let g3 = this.mapToGrid(m2);
    let c3 = this.gridToCanvas(g3);

    this.context.lineWidth = 10;
    this.context.beginPath();
    this.context.arc(c2[0], c2[1], 50, 0, 2 * Math.PI, false);
    this.context.strokeStyle = 'yellow';
    this.context.stroke();

    this.context.beginPath();
    this.context.arc(c3[0], c3[1], 60, 0, 2 * Math.PI, false);
    this.context.strokeStyle = 'orange';
    this.context.stroke();
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
    this.context.setTransform(scale, 0, 0, scale, x, y);

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

      if (false) {
        this.context.beginPath();
        // draw diamond, from left, to top, to right, to bottom, and back
        this.context.moveTo(0, this.halfH);
        this.context.lineTo(this.halfW, 0);
        this.context.lineTo(this.width, this.halfH);
        this.context.lineTo(this.halfW, this.height);
        this.context.closePath();
        this.context.fill();
      }
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
