export default class Stater {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext("2d");
  }

  set(state) {
    if (state.shadow) {
      let shadow = state.shadow;
      if (shadow.color) {
        this.context.shadowColor = shadow.color;
      }
      if (shadow.x || shadow.y) {
        this.context.shadowOffsetX = shadow.x ?? 0;
        this.context.shadowOffsetY = shadow.y ?? 0;
      }
      if (shadow.blur) {
        this.context.shadowBlur = shadow.blur;
      }
    }
  }

  push() {
    this.context.save();
  }

  pop() {
    this.context.restore();
  }

  reset() {
    this.context.reset();
  }
}
