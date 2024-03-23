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
    const stringInput = element('textarea', this.settings.body, div);
    stringInput.addEventListener('input', (event) => {
      this.settings.setBody(event.target.value);
      this.update();
    });
    stringInput.style.resize = 'vertical';
    stringInput.style.minHeight = '6em'; // Minimum height of 2 lines of text
  }

  makeFoo(div) {
    const boolLabel = element('label', 'Foo:', div);
    const boolInput = element('input', null, boolLabel);
    boolInput.type = 'checkbox';
    boolInput.checked = this.settings.foo;
    boolInput.addEventListener('change', (event) => {
      this.settings.setFoo(event.target.value);
      this.update();
    });
    boolLabel.style.display = 'inline-flex';
    boolInput.style.marginRight = '0.5em';
  }

  makeBar(div) {
    const boolLabel = element('label', 'Bar:', div);
    const boolInput = element('input', null, boolLabel);
    boolInput.type = 'number';
    boolInput.min = 0;
    boolInput.max = 10;
    boolInput.value = this.settings.bar;
    boolInput.addEventListener('change', (event) => {
      this.settings.setBar(event.target.value);
      this.update();
    });
    boolLabel.style.display = 'inline-flex';
    boolInput.style.marginRight = '0.5em';
    boolInput.style.fontSize = '16px'; // Set the font size (adjust as needed)
    boolInput.style.fontFamily = 'monospace'; // Set the font family to monospace
    boolInput.style.width = '4em'; // Set the width to fit about 4 characters (adjust as needed)
    boolInput.style.textAlign = 'right'}

  update() {
    this.persist.textContent = this.settings.persist.json;
  }

  make() {
    const div = document.createElement('div');
    div.className = 'settings-container';
    this.parentElement.appendChild(div);
    div.style.display = 'flex';
    div.style.flexDirection = 'column';

    this.makeBody(div);
    this.makeFoo(div);
    this.makeBar(div);

    element('br', null, div);

    this.persist = element('label', '', div);
    this.persist.style.whiteSpace = 'pre-wrap';
    this.persist.style.overflowWrap = 'break-word';
    this.persist.style.fontFamily = 'monospace';
    this.update();
  }
}
