import Doc from './d/doc.js';

/* Display and persist the settings for the editor.
*/
export default class Settings {
  constructor(persist) {
    this.persist = persist;
    this.authToken = persist.get('authtoken', '');
    this.device = persist.get('device', '');
    this.testmode = persist.get('testmode', 'false');
  }

  addTo(parent) {
    let doc = new Doc(parent);

    doc.add('text', 'authtoken');
    let input = doc.add('input');
    input.value = this.authToken;
    input.style.width='40em';
    input.addEventListener('input', (e) => {
      this.authToken = e.srcElement.value.trim();
      this.persist.set('authtoken', this.authToken);
    });

    doc.add('br');

    doc.add('text', 'device');
    let device = doc.add('input');
    device.value = this.device;
    device.style.width='40em';
    device.addEventListener('input', (e) => {
      this.device = e.srcElement.value.trim();
      this.persist.set('device', this.device);
    });

    doc.add('br');

    doc.add('text', 'test mode');
    let test = doc.add('input');
    test.type = 'checkbox';
    test.checked = this.testmode === 'true';
    test.addEventListener('change', (e) => {
      this.testmode = e.srcElement.checked? 'true' : 'false';
      this.persist.set('testmode', this.testmode);
    });

    return doc;
  }
}
