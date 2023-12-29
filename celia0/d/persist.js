export default class Persist {
  constructor(label = 'persist') {
    this.label = label;
    this.json = this.load();
    this.object = this.parse(this.json);
    let count = this.getInt('_count');
    this.set('_count', count + 1);
  }

  get(name, defaultValue = null) {
    return this.object[name];
    // TODO defaultValue
  }

  getInt(name, defautlValue = 0) {
    let i = defautlValue;
    try {
      i = parseInt(this.object[name]);
      if (isNaN(i)) {
        i = defautlValue;
      }
    }
    catch {}
    return i;
  }

  set(name, value) {
    this.object[name] = value;
    this.save();
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
