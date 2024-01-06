import Doc from './d/doc.js';

export default class PageSettings {
  constructor(parent, settings) {
    this.parent = parent;
    this.settings = settings;
    this.doc = new Doc(this.parent);

    this.settings.addTo(this.parent);
  }
}
