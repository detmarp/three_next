export default class Dixie {
  constructor(root) {
    this.root = root;
    this.makeOuter();
  }

  makeOuter() {
    this.outer = document.createElement('div');
    this.outer.classList.add('dixie-outer');
    this.root.appendChild(this.outer);
  }
}
