import Pattern from './pattern.js';

export default class DrawCard {
  constructor(iris) {
    this.iris = iris;
    this.context = iris.context;
    this.scale = 1.3;
    this.w = 144 * this.scale;
    this.h = 240 * this.scale;
  }

  getBounds(position) {
    this.bounds = [...position, this.w, this.h];
    return this.bounds;
  }

  setCard(card) {
    this.card = card;
    this.pattern = new Pattern(card.shape);
    this.text1.innerHTML = card.name;
    this.text2.innerHTML = card.text;
  }

  draw(card) {
    let meta = {
      position: this.bounds,
      scale: this.scale,
    };
    this.iris.helly.draw('card00', null, meta);
    let center = this._center(this.bounds, [0, 43]);
    this.pattern.draw(this.context, center);
  }

  setupText() {
    let upper = [...this.bounds];
    upper[0] += 4;
    upper[1] += 4;
    this.text1 = this.iris.addText('', upper);
    let lower = [this.bounds[0] + 5, this.bounds[1] + 258, this.w, this.h];
    this.text2 = this.iris.addText('', lower);
  }

  rotate() {
    this.pattern.rotate();
  }

  _center(bounds, offset = [0,0]) {
    return [
      bounds[0] + bounds[2] / 2 + offset[0],
      bounds[1] + bounds[3] / 2 + offset[1]
    ];
  }

}