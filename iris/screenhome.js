export default class ScreenHome {
  constructor(program) {
    this.program = program;
    this.parent = program.overlay;
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

    this._text('Tiny Towns');

    this._text('Home screen');

    this._button('New Game', () => {
      this.program.goto('newgame');
    });

    this._button('Settings', () => {
      this.program.goto('settings');
    });

    this._text('-----');

    this._text('List of current or recent games');

    this._button('Continue game', () => {
      this.program.goto('game');
    });

    this._button('Retry game', () => {
      this.program.goto('game');
    });
  }

  render(time, dt) {
  }
}
