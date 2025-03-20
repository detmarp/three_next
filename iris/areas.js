import Mytouch from './mytouch.js';

export default class Areas {
  constructor(iris) {
    this.iris = iris;
    this.myTouch = new Mytouch(iris.canvas);
    this.myTouch.onChangeCallback = this.onChanged.bind(this);
    this.list = []
    this._resetState('idle');
  }

  onChanged(touches, type) {
    let lastState = this.state;

    let current;
    if (touches.length > 0) {
      this.position = this.iris.windowToDiv(touches[0].end);
      const areaIndex = this._findArea(this.position);
      current = this.list[areaIndex];
    }

    switch (this.state) {
      case 'idle':
      if (type === 'start') {
        if (touches.length === 1 && current) {
          this.state = 'touching';
          this.start = current;
          this.end = current;
            this.canClick = Boolean(this.start.onClick);
          this.canDrag = (this.start.onDrag && this.start.onDrag('start', this.start));
        } else {
          this._resetState('bad');
        }
      }
      break;

      case 'touching':
        if (type === 'none') {
          if (this.canClick && (this.start === this.end)) {
            this.start.onClick();
          }
          else if(this.canDrag) {
            this.start.onDrag('drop', this.end);
          }
          this._resetState('idle');
        }
        else if (type === 'move') {
          this.end = current;
        }
        else if (touches.length > 1) {
          this._resetState('bad');
        }
        break;

      case 'bad':
      if (type === 'none') {
        this._resetState('idle');
      }
      break;
    }
    if (lastState !== this.state) {
      //console.log(`${this.state} ${this.start} ${this.end}`);
    }
  }

  _findArea(position) {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const [x, y, w, h] = this.list[i].bounds;
      if (position[0] >= x && position[0] <= x + w &&
        position[1] >= y && position[1] <= y + h) {
        return i;
      }
    }
  }

  _resetState(state) {
    if (this.start && this.start.onDrag) {
      this.start.onDrag('end', this.end);
    }
    this.state = state;
    this.start = null;
    this.end = null;
    this.position = null;
    this.canClick = false;
    this.canDrag = false;
  }

  addBounds(bounds, onCLick, onDrag) {
    let area = {
      bounds: bounds,
      onClick: onCLick,
      onDrag: onDrag
    };
    this.list.push(area);
    return area;
  }

  _debugDraw(ctx) {
    this.list.forEach(area => {
      const [x, y, w, h] = area.bounds;
      var color;
      if (area === this.start && area === this.end) {
        color = 'orange';
      } else if (area === this.start) {
        color = 'red';
      } else if (this.canDrag && area === this.end) {
        color = 'yellow';
      }
      if (color) {
        ctx.lineWidth = 6;
        ctx.strokeStyle = color;
        ctx.strokeRect(x, y, w, h);
      }
    });
  }
}
