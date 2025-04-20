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
        console.log('bbb Settings loaded:', JSON.stringify(this.data));
  } else {
        this.defaults();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      console.log('ccc Settings default:', JSON.stringify(this.data));
      this.defaults();
    }
    if (callback) callback();
  }

  defaults() {
    this.data = {
      mode: 'normal',
    };
  }

  save() {
    localStorage.setItem('settings', JSON.stringify(this.data));
    console.log('aaa Settings saved:', JSON.stringify(this.data));
  }

  delete() {
    localStorage.removeItem('settings');
    this.defaults();
  }
}