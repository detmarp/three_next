export default class Settings {
  constructor() {
    this.layout = null;
    this.data = {};
    this.defaults();
  }

  load(callback) {
    try {
      const savedData = localStorage.getItem('settings');
      if (savedData) {
        this.data = JSON.parse(savedData);
      } else {
        this.defaults();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      this.defaults();
    }
    console.log(this.data);
    if (callback) callback();
  }

  defaults() {
    this.data = {
      mode: 'normal',
    };
  }

  save() {
    localStorage.setItem('settings', JSON.stringify(this.data));
  }
}