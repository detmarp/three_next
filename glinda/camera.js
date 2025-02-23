import Mytouch from './mytouch.js';

export default class Camera {
  constructor(context) {
    this.context = context;
    this.initEventListeners();
  }

  initEventListeners() {
    this.mytouch = new Mytouch(this.context.canvas);
    this.mytouch.onChangeCallback = this.onChanged.bind(this);
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
    console.log(`Hey type: ${type}, touches: ${JSON.stringify(touches)}`);
  }
}
