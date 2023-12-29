import Doc from './d/doc.js';

/* Display and persist the settings for the editor.
*/
export default class Settings {
  constructor(persist) {
    this.persist = persist;
    this.authToken = persist.get('authtoken', '');
  }

  addTo(parent) {
    let doc = new Doc(parent);
    let input = doc.add('input');
    input.value = this.authToken;
    input.style.width='40em';
    input.addEventListener('input', (e) => {
      this.authToken = e.srcElement.value;
      this.persist.set('authtoken', this.authToken);
    });
  }
}
