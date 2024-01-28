import Doc from './d/doc.js';

/* Display and persist the settings for the editor.
*/
export default class Settings {
  constructor(persist) {
    this.persist = persist;
    this.authToken = persist.get('authtoken', '');
    this.device = persist.get('device', '');
  }

  addTo(parent) {
    let doc = new Doc(parent);

    doc.add('text', 'authtoken');
    let input = doc.add('input');
    input.value = this.authToken;
    input.style.width='40em';
    input.addEventListener('input', (e) => {
      this.authToken = e.srcElement.value;
      this.persist.set('authtoken', this.authToken);
    });

    doc.add('br');

    doc.add('text', 'device');
    let device = doc.add('input');
    device.value = this.device;
    device.style.width='40em';
    device.addEventListener('input', (e) => {
      this.device = e.srcElement.value;
      this.persist.set('device', this.device);
    });
  }
}
