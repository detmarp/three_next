export default class Settings {
  constructor(persist, defaults = {}) {
    this.persist = persist;
    this.values = {};
    this.defaults = defaults;
    this.resetDefaults(); // Initialize with defaults
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
    this.values = {...this.defaults}; // Create a new copy of defaults
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
