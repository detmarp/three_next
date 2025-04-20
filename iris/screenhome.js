export default class ScreenHome {
  constructor(program) {
    this.program = program;
    this.parent = program.overlay;
    this._setup();
  }

  _text(text, parent = this.parent) {
    let element = document.createElement('div');
    element.textContent = text;
    element.style.marginBottom = '10px';
    parent.appendChild(element);
    parent.appendChild(document.createElement('br'));
    return element;
  }

  _button(label, callback, parent = this.parent) {
    let element = document.createElement('button');
    element.textContent = label;
    element.onclick = callback;
    parent.appendChild(element);
    parent.appendChild(document.createElement('br'));
    parent.appendChild(document.createElement('br'));
    return element;
  }

  _exitTo(mode, data = null) {
    this._stopUpdate();
    this.program.goto(mode, data);
  }

  _setup() {
    this.parent.innerHTML = '';

    this._text('Tiny Towns');

    this._text('Home screen');

    this._button('Quick start', () => {
      this._exitTo('quickstart');
    });

    this._button('Settings', () => {
      this._exitTo('settings');
    });

    this._text('-----');

    this.history = document.createElement('div');
    this.history.id = 'history';
    this.parent.appendChild(this.history);
    this._updateHistory();

    this._button('Continue game', () => {
      this._exitTo('game');
    });

    this._button('Retry game', () => {
      this._exitTo('game');
    });

    this.historyUpdateInterval = setInterval(() => {
      this._updateHistory();
    }, 1 * 1000);
  }

  _stopUpdate() {
    if (this.historyUpdateInterval) {
      clearInterval(this.historyUpdateInterval);
      this.historyUpdateInterval = null;
    }
  }

  _updateHistory() {
    this.history.innerHTML = '';

    if (this.program.iris.settings.data.current) {
      this._text('Current', this.history);
      this._gameLine(this.history, this.program.iris.settings.data.current);
    }
    if (Array.isArray(this.program.iris.settings.data.history) && this.program.iris.settings.data.history.length > 0) {
      this._text('-----', this.history);
      this._text('History', this.history);
      for (let game of this.program.iris.settings.data.history) {
        this._gameLine(this.history, game);
      }
    }
  }

  _ago(timestamp) {
    const seconds = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    //if (seconds < 60) return 'now';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  }

  _gameLine(element, game) {
    let container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.justifyContent = 'space-between';

    let text = document.createElement('span');
    text.textContent = `${game.uuid.slice(-8)} - Score: ${game.score || 0} - ${this._ago(game.timestamp)}`;
    container.appendChild(text);

    let button = document.createElement('button');
    button.textContent = 'Load';
    button.onclick = () => {
      this._exitTo('game', game);
    };
    container.appendChild(button);

    element.appendChild(container);
    return container;
  }

  render(time, dt) {
  }
}
