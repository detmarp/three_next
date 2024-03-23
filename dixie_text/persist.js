export default class Persist {
  constructor(label = 'persist') {
    this.label = label;
    this.json = this.load();
    this.object = this.parse(this.json);
    this.increment()
  }

increment() {
  let count = this.getInt('_count');
  this.set('_count', count + 1, false);
}

get(name, defaultValue = null) {
    if (!this.object.hasOwnProperty(name)) {
      return defaultValue;
    }

    return this.object[name];
  }

  getInt(name, defautlValue = 0) {
    let i = defautlValue;
    try {
      i = parseInt(this.object[name]);
      if (isNaN(i)) {
        i = defautlValue;
      }
    }
    catch { }
    return i;
  }

  set(name, value, increment = true) {
    this.object[name] = value;
    this.save(increment);
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

  save(increment = false) {
    this.json = JSON.stringify(this.object);
    window.localStorage[this.label] = this.json;
    if (increment) {
      this.increment();
    }
  }

  parse(json) {
    let object = {};
    try {
      object = JSON.parse(this.json);
    }
    catch { }
    if (!object || (typeof (object) !== 'object')) {
      object = {};
    }

    return object;
  }

  reset() {
    this.json = '{}';
    this.object = {};
    window.localStorage.removeItem(this.label);
  }
}
