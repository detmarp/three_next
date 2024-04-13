export default class Settings {
  constructor(persist, defaults = {}) {
    this.persist = persist;
    this.values = {};
    this.defaults = defaults;
    this.resetDefaults();
    this.refresh();
  }

  get(key) {
    if (!key in this.values) {
      this.values[key] = this.persist.get(key) || this.defaults[key];
    }
    return this.values[key];
  }

  set(key, value) {
    this.values[key] = value;
    this.persist.set(key, value);
  }

  resetDefaults() {
    // Initialize with defaults
    this.values = {...this.defaults}; // copy
  }

  refresh() {
    // Only fetch from persist if the key exists in defaults
    for (const key in this.defaults) {
      const persistedValue = this.persist.get(key);
      if (persistedValue !== undefined) {
        this.values[key] = persistedValue;
      }
    }
  }
}
