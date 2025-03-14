import Mytouch from './mytouch.js';

export default class Areas {
  constructor(iris) {
    this.iris = iris;
    this.myTouch = new Mytouch(iris.canvas);
    this.myTouch.onChangeCallback = this.onChanged.bind(this);
    this.list = []
    this.state = 'idle';
  }

  onChanged(touches, type) {
    console.log('Touches:', touches, 'Type:', type);
    let lastState = this.state;
    switch (this.state) {
      case 'idle':
      if (type === 'start') {
        if (touches.length === 1) {
          this.state = 'touching';
        } else {
          this.state = 'bad';
        }
      }
      break;

      case 'touching':
        if (type === 'none') {
          this.state = 'idle';
        }
        else if (type === 'move') {
          console.log('Dragging:', touches);
        }
        else if (touches.length > 1) {
          this.state = 'bad';
        }
        break;

      case 'bad':
      if (type === 'none') {
        this.state = 'idle';
      }
      break;
    }
    if (lastState !== this.state) {
      console.log('State:', this.state);
    }
  }

  add(area) {
    this.list.push(area);
  }

  _debugDraw(ctx) {
    ctx.strokeStyle = 'magenta';
    this.list.forEach(area => {
      const [x, y, w, h] = area;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, w, h);
    });
  }
}
