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

    this._text('New game');

    this._button('< back', () => {
      this.program.goto('home');
    });

    this._text('Cottage - cottage - blue - 1/1');
    this._text('Theater - theater - yellow - 1/1');
    this._text('Tavern - tavern - green - 1/1');
    this._text('Chapel - chapel - orange - 1/1');
    this._text('Factory - factory - black - 1/1');
    this._text('Farm - farm - red - 1/1');
    this._text('Well - well - gray - 1/1');
    this._text('Architect\'s Guild - guild - pink - 1/1');

    this._button('Play', () => {
      this.program.goto('game');
    });

    //this._button('Game editor', () => {
    //  this.program.goto('editor');
    //});
  }

  render(time, dt) {
  }
}
