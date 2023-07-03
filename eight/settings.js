function _create(tag, inner) {
  let el = document.createElement(tag);
  if (inner) {
    el.innerHTML = inner;
  }
  return el;
}

function add(parent, tag) {
  let el = document.createElement(tag);
  parent.appendChild(el);
  return el;
}


import {AiStuff} from './aistuff.js';

export class Settings {
  constructor() {
    this.body = document.createElement('div');
    this.apiKey = window.localStorage['apikey'] ?? '';
  }

  makeElement() {
    this.build();
    return this.body;
  }

  build() {
    let div = document.createElement('div');
    div.appendChild(this.header = _create('div'));
    div.appendChild(_create('hr'));
    div.appendChild(this.testText = document.createElement('div'));
    div.appendChild(_create('hr'));
    div.appendChild(this.testImage = document.createElement('div'));

    // Make header elements
    this.header.appendChild(_create('h1', 'Settings'));
    this.header.appendChild(_create('div', 'API key'));
    let input = _create('input');
    input.setAttribute('value', this.apiKey);
    input.style.width='40em';
    input.addEventListener('input', (e) => {
      this.apiKey = e.srcElement.value;
      window.localStorage['apikey'] = this.apiKey;
    });
    this.header.appendChild(input);

    // Make test button elements
    this._textStart();
    this._imageStart();

    this.body.replaceChildren(div);
  }

  _textStart() {
    // Make button to request AI text
    let button = _create('button', 'Test text');
    this.testText.replaceChildren(button);

    button.addEventListener('click', () => {
      // Request
      let cancel = _create('button', 'X loading');
      this.testText.replaceChildren(cancel);
      let ai = new AiStuff(this.apiKey);
      cancel.addEventListener('click', () => {
        // Cancel
        ai.cancel();
        this._textStart();
      });
      ai.testText(result => {
        this._textResult(result ?? '[error]');
      });
    });
  }

  _textResult(result) {
    this._textStart();
    this.testText.appendChild(_create('p', result));
  }

  _imageStart() {
    // Make button to request AI text
    let button = _create('button', 'Test image');
    this.testImage.replaceChildren(button);

    button.addEventListener('click', () => {
      // Request
      let cancel = _create('button', 'X loading');
      this.testImage.replaceChildren(cancel);
      let ai = new AiStuff(this.apiKey);
      cancel.addEventListener('click', () => {
        // Cancel
        ai.cancel();
        this._imageStart();
      });
      ai.testImage(result => {
        this._imageResult(result);
      });
    });
  }

  _imageResult(result) {
    this._imageStart();
    if (result) {
      this.testImage.appendChild(_create('p'));
      let i = _create('img');
      i.src = result;
      this.testImage.appendChild(i);
    }
    else {
      this.testImage.appendChild(_create('p', '[error]'));
    }
  }
}


