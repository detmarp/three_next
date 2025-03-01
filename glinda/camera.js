import Mytouch from './mytouch.js';

export default class Camera {
  constructor(context) {
    this.context = context;
    this.initEventListeners();

    const canvas = this.context.canvas;
    this.center = [canvas.width / 2, canvas.height / 2];
    this.scale = 0.5;
    this.dragged = [0,0];
    this.dt = 1 / 60;

    this.debug = true;

    this.update();
  }

  initEventListeners() {
    this.mytouch = new Mytouch(this.context.canvas);
    this.mytouch.onChangeCallback = this.onChanged.bind(this);
  }

  update(dt) {
    this.dt = dt;

    const canvas = this.context.canvas;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    let scale = this.scale;
    let x = centerX - this.center[0] * scale;
    let y = centerY - this.center[1] * scale;
    this.context.setTransform(scale, 0, 0, scale, x, y);

    if (this.debug) {
      //console.log('Inertia:', this.inertia);
    }
  }

  debug_draw() {
    const prevTransform = this.context.getTransform();

    this.mytouch.touches.forEach((touch, index) => {
      this._dot(index, touch.start[0], touch.start[1]);
      this._dot(index, touch.end[0], touch.end[1]);
    });
    if (this.mytouch.count > 0) {
      //this._dot(this.mytouch.count - 1, this.mytouch.mousePosition[0], this.mytouch.mousePosition[1]);
    }

    this.context.setTransform(prevTransform);
  }

  _dot(color, x, y) {
    const colors = ['red', 'orange', 'yellow', 'lime', 'blue'];
    this.context.strokeStyle = colors[Math.min(color, colors.length - 1)];
    const size = 0.05 * Math.max(this.context.canvas.width, this.context.canvas.height);
    this.context.setTransform(1, 0, 0, 1, 0, 0);
    this.context.translate(x, y);
    this.context.beginPath();
    this.context.arc(0, 0, size, 0, 2 * Math.PI, false);
    this.context.lineWidth = 10;
    this.context.stroke();

  }

  onChanged(touches, type) {
    if (type == 'start') {
      if (touches.length == 1) {
        this.startDrag = this.center;
      }
      else if (touches.length == 2) {
        this.startScale = this.scale;
      }
      else if (touches.length == 3) {
        this.debug = !this.debug;
      }
    }

    if (type == 'move') {
      if (touches.length == 1 && this.startDrag) {
        let touch = touches[0];
        let x = this.startDrag[0] + (touch.start[0] - touch.end[0]) / this.scale;
        let y = this.startDrag[1] + (touch.start[1] - touch.end[1]) / this.scale;
        let delta = [x - this.center[0], y - this.center[1]];
        this.dragged = [delta[0] / this.dt, delta[1] / this.dt];
        this.center = [x, y];
      }
      if (touches.length == 2 && this.startScale) {
        let touch1 = touches[0];
        let touch2 = touches[1];
        let startDistance = Math.hypot(touch1.start[0] - touch2.start[0], touch1.start[1] - touch2.start[1]);
        let endDistance = Math.hypot(touch1.end[0] - touch2.end[0], touch1.end[1] - touch2.end[1]);
        if (startDistance > 0) {
          let scale = this.startScale * endDistance / startDistance;
          scale = Math.max(0.3, Math.min(scale, 10));
          this.scale = scale;
        }
      }
    }
  }
}
