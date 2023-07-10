import {TabMaker} from './tabmaker.js';
import {Settings} from './settings.js';
import {Two} from './two.js';

export class Program {
  constructor(root) {
    this.root = root;
    this.id = 0;
    this.settings = new Settings();
    this.two = new Two(this.settings);
  }

  run() {
    let maker = new TabMaker();
    maker.addTab('Two', () => this.two.makeElement());
    maker.addTab('Settings', () => this.settings.makeElement());
    //maker.addTab('three', () => this.makeElement());
    let tabs = maker.create()

    this.root.replaceChildren(tabs);
  }
}
