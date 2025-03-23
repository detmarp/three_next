import Pattern from './pattern.js';

export default class DrawCard {
  constructor(iris) {
    this.iris = iris;
    this.context = iris.context;
    this.w = 144;
    this.h = 240;
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
    this.iris.helly.draw('card00', this.bounds);
    let center = this._center(this.bounds, [0, 30]);
    this.pattern.draw(this.context, center);
  }

  setupText() {
    let upper = [...this.bounds];
    this.text1 = this.iris.addText('', upper);
    let lower = [...this.bounds];
    lower[1] += 200;
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