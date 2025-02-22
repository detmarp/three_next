export default class Mytouch {
  constructor(canvas) {
    this.canvas = canvas;
    this.count = 0;
    this.buttonMask = 0;
    this.initEventListeners();
  }

  initEventListeners() {
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('mouseleave', this.onMouseLeave.bind(this));
    this.canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
    this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this));

    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
  }

  onMouseDown(event) {
    event.preventDefault();
    let mask = 1 << event.button;
    if (!(this.buttonMask & mask)) {
      this.buttonMask |= mask;
      this.onCountChanged(this.count + 1);
    }
  }

  onMouseUp(event) {
    event.preventDefault();
    let mask = 1 << event.button;
    if (this.buttonMask & mask) {
      this.buttonMask &= ~mask;
      this.onCountChanged(this.count - 1);
    }
  }

  onMouseLeave(event) {
    event.preventDefault();
    if (this.buttonMask) {
      this.buttonMask = 0;
      this.onCountChanged(0);
    }
  }

  onTouchStart(event) {
    event.preventDefault();
    this.onCountChanged(event.touches.length);
  }

  onTouchEnd(event) {
    event.preventDefault();
    this.onCountChanged(event.touches.length);
  }

  onCountChanged(count) {
    this.count = count;
    console.log(`count: ${this.count}, mask: ${this.buttonMask}`);
  }
}
