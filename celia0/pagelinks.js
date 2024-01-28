import Doc from './d/doc.js';

export default class PageLinks {
  constructor(parent) {
    this.parent = parent;
    this.doc = new Doc(this.parent);

    this.add('https://github.com/detmarp');
    this.add('https://github.com/detmarp/notebook/tree/main/pages');
    this.add('https://detmarp.github.io/notebook/');
  }

  add(url) {
    this.doc.add('br');
    let a = this.doc.add('a', url);
    a.href = url;
    a.target = '_blank';
    this.doc.add('br');
  }
}
