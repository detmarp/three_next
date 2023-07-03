export class TabMaker {
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
      this.content.replaceChildren(this.items[i]());
    }
  }

  create() {
    this.select(0);
    return this.tab;
  }
}
