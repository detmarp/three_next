function element(type, text, parent) {
  let e = document.createElement(type);
  if (text) {
    e.textContent = text;
  }
  if (parent) {
    parent.appendChild(e);
  }
  return e; // Return the created element for further manipulation if needed
}

export default class SettingsPage {
  constructor(parentElement, settings) {
    this.parentElement = parentElement;
    this.settings = settings;
  }

  makeBody(div) {
    const stringLabel = element('label', 'Body:', div);
    const body = element('textarea', null, div);
    body.addEventListener('input', (event) => {
      this.settings.setBody(event.target.value);
      this.updateUi();
    });
    body.style.resize = 'vertical';
    body.style.minHeight = '6em'; // Minimum height of 2 lines of text

    return body;
  }

  makeFoo(div) {
    const boolLabel = element('label', 'Foo:', div);
    const foo = element('input', null, boolLabel);
    foo.type = 'checkbox';
    foo.addEventListener('change', (event) => {
      this.settings.setFoo(event.target.checked);
      this.updateUi();
    });
    boolLabel.style.display = 'inline-flex';
    foo.style.marginRight = '0.5em';

    return foo;
  }

  makeBar(div) {
    const boolLabel = element('label', 'Bar:', div);
    const bar = element('input', null, boolLabel);
    bar.type = 'number';
    bar.min = 0;
    bar.max = 10;
    bar.addEventListener('change', (event) => {
      this.settings.setBar(event.target.value);
      this.updateUi();
    });
    boolLabel.style.display = 'inline-flex';
    bar.style.marginRight = '0.5em';
    bar.style.fontSize = '16px'; // Set the font size (adjust as needed)
    bar.style.fontFamily = 'monospace'; // Set the font family to monospace
    bar.style.width = '4em'; // Set the width to fit about 4 characters (adjust as needed)
    bar.style.textAlign = 'right'

    return bar;
  }

  makeButton(div, label, callback) {
    const button = element('button', label, div);
    button.addEventListener('click', (event) => {
      callback(event.target.value)
    });
    button.style.width = '10em';
    button.style.marginTop = '5px';
    return button;
  }

  updateUi() {
    this.body.value = this.settings.body;
    this.foo.checked = this.settings.foo;
    this.bar.value = this.settings.bar;
    this.persist.textContent = this.settings.persist.json;
  }

  make() {
    const div = document.createElement('div');
    div.className = 'settings-container';
    this.parentElement.appendChild(div);
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    this.body = this.makeBody(div);
    this.foo = this.makeFoo(div);
    this.bar = this.makeBar(div);

    element('br', null, div);

    this.makeButton(div, 'Reset defaults', (value) => {
      this.settings.resetDefaults();
      this.updateUi();
    });
    this.makeButton(div, 'Hard clear', (value) => {
      this.settings.persist.reset();
      this.settings.refresh();
      this.updateUi();
    });
    this.makeButton(div, 'Corrupt', (value) => {
      this.settings.setBody({});
      this.settings.setFoo('string');
      this.settings.setBar('string');
      this.settings.setTab('string');
      this.settings.refresh();
      this.updateUi();
    });

    element('br', null, div);

    this.persist = element('label', '', div);
    this.persist.style.whiteSpace = 'pre-wrap';
    this.persist.style.overflowWrap = 'break-word';
    this.persist.style.fontFamily = 'monospace';

    this.updateUi();
  }
}
