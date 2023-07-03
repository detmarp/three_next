import {TabMaker} from './tabmaker.js';
import {Settings} from './settings.js';

export class Program {
  constructor(root) {
    this.root = root;
    this.id = 0;
    this.settings = new Settings();
  }

  makeElement() {
    let el = document.createElement('div');
    el.appendChild(document.createTextNode(`id: ${this.id++}`));
    return el;
  }

  run() {
    let maker = new TabMaker();
    maker.addTab('Settings', () => this.settings.makeElement());
    maker.addTab('two', () => this.makeElement());
    maker.addTab('three', () => this.makeElement());
    let tabs = maker.create()

    this.root.replaceChildren(tabs);
  }
}
