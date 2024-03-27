export default class Settings {
  constructor(persist) {
    this.persist = persist;
    this.refresh();
  }

  get(key) {
    if (! key in this) {
      this[key] = this.persist.get(key);
    }
    return this[key];
  }

  set(key, value) {
    this[key] = value;
    this.persist.set(key, value);
  }

  setBody(text) {
    this.persist.set('body', text);
    this.body = text;
  }

  setFoo(foo) {
    this.persist.set('foo', foo);
    this.foo = foo;
  }

  setBar(bar) {
    this.persist.set('bar', bar);
    this.bar = bar;
  }

  setTab(tab) {
    this.persist.set('tab', tab);
    this.tab = tab;
  }

  resetDefaults() {
    this.refresh();
  }

  refresh() {
  }
}