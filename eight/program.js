class TabMaker {
  constructor() {
    this.items = [];
    this.index = -1;

    this.tabbar = document.createElement('div');

    this.content = document.createElement('div');

    this.tab = document.createElement('div');
    this.tab.appendChild(this.tabbar);
    this.tab.appendChild(this.content);
  }

  addTab(label, getter) {
    let button = document.createElement('button');
    let i = this.items.length;
    button.textContent = label;
    button.addEventListener('click', () => this.select(i));
    this.items.push(getter);

    this.tabbar.appendChild(button);
  }

  select(i) {
    if (i != this.index) {
      this.index = i;
      this.content.replaceChildren();
      this.content.appendChild(this.items[i]());
    }
  }

  create() {
    this.select(0);
    return this.tab;
  }
}


export class Program {
  constructor(root) {
    this.root = root;
    this.id = 0;
  }

  makeElement() {
    let el = document.createElement('div');
    el.appendChild(document.createTextNode(`id: ${this.id++}`));
    return el;
  }

  run() {
    let maker = new TabMaker();
    maker.addTab('one', () => this.makeElement());
    maker.addTab('two', () => this.makeElement());
    maker.addTab('three', () => this.makeElement());
    let tabs = maker.create()

    this.root.replaceChildren();
    this.root.appendChild(tabs);
  }
}
