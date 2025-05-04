import Rules from './rules.js';

export default class ScreenHome {
  constructor(program) {
    this.program = program;
    this.parent = document.createElement('div');
    this.parent.style.overflowY = 'auto';
    this.parent.style.maxHeight = '100%';
    this.parent.style.width = '100%';
    this.program.overlay.appendChild(this.parent);
    this.parent.style.pointerEvents = 'auto'; // Allow drag and scroll wheel events
    this.parent.style.overflowY = 'hidden'; // Hide the vertical scrollbar

    let isDragging = false;
    let startY, scrollTop;

    this.parent.addEventListener('mousedown', (e) => {
      isDragging = true;
      startY = e.pageY - this.parent.offsetTop;
      scrollTop = this.parent.scrollTop;
      this.parent.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const y = e.pageY - this.parent.offsetTop;
      const walk = (y - startY) * 1; // Adjust scroll speed if needed
      this.parent.scrollTop = scrollTop - walk;
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
      this.parent.style.cursor = 'default';
    });
    this._setup();
  }

  _text(text) {
    let element = document.createElement('div');
    element.textContent = text;
    element.style.marginBottom = '10px';
    this.parent.appendChild(element);
    this.parent.appendChild(document.createElement('br'));
    return element;
  }

  _button(label, callback) {
    let element = document.createElement('button');
    element.textContent = label;
    element.onclick = callback;
    this.parent.appendChild(element);
    this.parent.appendChild(document.createElement('br'));
    this.parent.appendChild(document.createElement('br'));
    return element;
  }

  _setup() {
    this.parent.innerHTML = '';

    this._text('Settings');

    this._button('< back', () => {
      this.program.goto('home');
    });

    this._text('----');

    let autoContinueCheckbox = document.createElement('input');
    autoContinueCheckbox.type = 'checkbox';
    autoContinueCheckbox.checked = this.program.iris.settings.data.autocontinue || false;
    autoContinueCheckbox.onchange = (e) => {
      this.program.iris.settings.data.autocontinue = e.target.checked;
      this.program.iris.settings.save();
    };
    let label = document.createElement('label');
    label.textContent = ' Auto-continue last game';
    label.prepend(autoContinueCheckbox);
    this.parent.appendChild(label);
    this.parent.appendChild(document.createElement('br'));
    this.parent.appendChild(document.createElement('br'));

    this._text('----');
    this._text('Default rules');
    this.rulesEditor = new Rules(this.program.iris.settings.data.rules);
    this.rulesEditor.editor(this.parent, () => {
      // rules updated
      this.program.iris.settings.save();
    });
    this._text('----');

    this._text('----');
    this._button('Hard delete', () => {
      this.program.iris.settings.delete();
      this.program.goto('home');
    });
  }

  render(time, dt) {
  }
}
