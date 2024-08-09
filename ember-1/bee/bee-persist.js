export default class BeePersist {
  constructor(label = 'bee-persist') {
    this.label = label;
    this.json = this.load();
    this.object = this.parse(this.json);
    console.log(this.json);//detmar ddd1
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

  getBool(name, defautlValue = false) {
    let b = defautlValue;
    try {
      b = JSON.parse(this.object[name]);
    }
    catch { }
    return b;
  }

  set(name, value, increment = true) {
    this.object[name] = value;
    this.save(increment);
  }

  delete(name, increment = true) {
    delete this.object[name];
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
    console.log(this.json);//detmar ddd2
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
