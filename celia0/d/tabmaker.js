import Doc from './doc.js';

export default class TabMaker {
  constructor(parent) {
    this.parent = parent;
    this.doc = new Doc(this.parent);

    this.tabs = new Map();
    this.id = 0;
    this.selected = 0;

    this.top = this.doc.add('div');
    this.content = this.doc.add('div');
  }

  add(label) {
    let tab = this.doc.add('text', label, this.top);
    tab.classList.add('tab');

    let body = document.createElement('div');
    let info = {
      id: this.id,
      tab: tab,
      body: body,
    };
    this.tabs.set(this.id, info);
    this.doc.onClick(tab, () => this.select(info));

    if (this.id == 0) {
      this.select(info);
    }

    this.id++;

    return body;
  }

  select(info) {
    this.selected = info.id;
    this.content.replaceChildren(info.body);

    this.tabs.forEach((value, key, map) => {
      if (value.id == this.selected) {
        value.tab.classList.add('selected');
      }
      else {
        value.tab.classList.remove('selected');
      }
    });
  }
}
