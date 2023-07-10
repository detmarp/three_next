function _create(tag, inner) {
  let el = document.createElement(tag);
  if (inner) {
    el.innerHTML = inner;
  }
  return el;
}


import {AiStuff} from './aistuff.js';

export class Two {
  constructor(settings) {
    this.settings = settings;
    this.body = document.createElement('div');
  }

  makeElement() {
    this.build();
    return this.body;
  }

  build() {
    let div = document.createElement('div');

    let a = this._makeTextSection('Pick a topic',
      () => 'In one word, a random current interesting topic, safe for kids.',
      result => this.topic = result
    );
    div.appendChild(a);

    let b = this._makeTextSection('Create context',
      () => `30 words related to: ${this.topic}`,
      result => this.context = result
    );
    div.appendChild(b);

    let c = this._makeTextSection('Fetch an ad',
      () => `Choose a random commercial product or company, and show short fake advertising slogan for it.`,
      result => this.ad = result
    );
    div.appendChild(c);

    let d = this._makeTextSection('Generate image',
      () => `Given this context: "${this.context}" make an attractive background ad image for this product: ${this.ad}`,
      result => {
        this.ad = result;
        // We have an image URL - show it.
        let i = _create('img');
        i.src = result;
        showImage.replaceChildren(i);
      },
      'generations'
    );
    div.appendChild(d);
    let showImage = document.createElement('div');
    div.appendChild(showImage);

    this.body.replaceChildren(div);
  }

  _makeTextSection(title, promptGetter, resultSetter, model = 'completions') {
    // Hacky little function to set some buttons and make a request.
    let div = document.createElement('div');
    div.appendChild(_create('hr'));
    div.appendChild(_create('h3', title));

    let resetButton = _create('button', 'Reset');
    resetButton.addEventListener('click', () => {
      promptArea.value = promptGetter();
    });
    div.appendChild(resetButton);

    div.appendChild(_create('br'));
    let promptArea = _create('textarea', promptGetter());
    promptArea.style.width = '40em';
    div.appendChild(promptArea);

    div.appendChild(_create('br'));
    let requestButton = _create('button', 'Request');
    let ai = new AiStuff(this.settings.apiKey);
    requestButton.addEventListener('click', async () => {
      if (requestButton.loading) {
        // Cancel request.
        requestButton.loading = false;
        requestButton.textContent  = 'Request';
    }
      else {
        // Start request.
        requestButton.loading = true;
        requestButton.textContent  = 'X loading';
        let response = await ai[model](promptArea.value);
        let r = (response ?? '[error]').trim();
        resultArea.value = r;
        requestButton.loading = false;
        requestButton.textContent  = 'Request';
        resultSetter(r);
      }
    });
    div.appendChild(requestButton);

    div.appendChild(_create('br'));
    let resultArea = _create('textarea', '');
    resultArea.style.width = '40em';
    resultArea.style.height = '3em';
    div.appendChild(resultArea);

    return div;
  }
}
