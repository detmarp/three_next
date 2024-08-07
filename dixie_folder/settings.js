export default class Settings {
  constructor(persist) {
    this.persist = persist;
    this.refresh();
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
    this.persist.delete('body');
    this.persist.delete('foo');
    this.persist.delete('bar');
    this.persist.delete('tab');
    this.refresh();
  }

  refresh() {
    this.body = this.persist.get('body');
    this.foo = this.persist.getBool('foo', false);
    this.bar = this.persist.getInt('bar', 1);
    this.tab = this.persist.getInt('tab', 0);
  }
}