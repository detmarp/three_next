export default class Settings {
  constructor(persist) {
    this.persist = persist;
    this.body = persist.get('body');
    this.foo = persist.getInt('foo');
    this.bar = persist.getInt('bar');
  }

  setBody(text) {
    this.persist.set('body', text);
  }

  setFoo(foo) {
    this.persist.set('foo', foo);
  }

  setBar(bar) {
    this.persist.set('bar', bar);
  }
}