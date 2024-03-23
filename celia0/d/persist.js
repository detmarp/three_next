export default class Persist {
  constructor(label = 'persist') {
    this.label = label;
    this.json = this.load();
    this.object = this.parse(this.json);
    let count = this.getInt('_count');
    this.set('_count', count + 1);
  }

  get(name, defaultValue = null) {
    if (!this.object.hasOwnProperty(name)) {
      return defaultValue;
    }

    return this.object[name];
  }

  getInt(name, defaultValue = 0) {
    let i = defaultValue;
    try {
      i = parseInt(this.object[name]);
      if (isNaN(i)) {
        i = defaultValue;
      }
    }
    catch {}
    return i;
  }

  set(name, value) {
    this.object[name] = value;
    this.save();
    return value
  }

  load() {
    let json = '';
    try {
      json = window.localStorage[this.label] ?? '';
    }
    catch {
      json = '';
    }
    return json;
  }

  save() {
    this.json = JSON.stringify(this.object);
    window.localStorage[this.label] = this.json;
  }

  parse(json) {
    let object = {};
    try {
      object = JSON.parse(this.json);
    }
    catch {}
    if (!object || (typeof(object) !== 'object')) {
      object = {};
    }

    return object;
  }

  reset() {
    this.json = '{}';
    this.object = {};
    window.localStorage[this.label] = null;
  }
}
