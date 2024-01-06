import Doc from './d/doc.js';

export default class PageBlank {
  constructor(parent) {
    this.parent = parent;
    this.doc = new Doc(this.parent);

    this.doc.add('h1', 'Blank');
  }
}
