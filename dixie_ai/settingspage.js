function element(type, text, parent) {
  let e = document.createElement(type);
  if (text) {
    e.textContent = text;
  }
  if (parent) {
    parent.appendChild(e);
  }
  return e;
}

export default class SettingsPage {
  constructor(parentElement, settings) {
    this.parentElement = parentElement;
    this.settings = settings;
  }

  makeBody(div, label) {
    const stringLabel = element('label', `${label}:`, div);
    const body = element('textarea', null, div);
    body.addEventListener('input', (event) => {
      this.settings.set('apikey', event.target.value);
      this.updateUi();
    });
    body.style.resize = 'vertical';
    body.style.minHeight = '6em';

    return body;
  }

  updateUi() {
    this.keyElement.value = this.settings.get('apikey');
    this.persistElement.textContent = this.settings.persist.json;
  }

  make() {
    const div = document.createElement('div');
    div.className = 'settings-container';
    this.parentElement.appendChild(div);
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    this.keyElement = this.makeBody(div, 'api key');

    element('br', null, div);

    this.persistElement = element('label', '', div);
    this.persistElement.style.whiteSpace = 'pre-wrap';
    this.persistElement.style.overflowWrap = 'break-word';
    this.persistElement.style.fontFamily = 'monospace';

    this.updateUi();
  }
}
