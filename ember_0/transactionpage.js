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

export default class MainPage {
  constructor(parentElement, program) {
    this.parentElement = parentElement;
    this.program = program;
  }

  make() {
    let data = this.program.brains.getOpenAiData();
    let text = JSON.stringify(data, null, 2);
    let e = element('p', `${text}`, this.parentElement);
    e.style.whiteSpace = 'pre-wrap';
    e.style.fontFamily = 'monospace';
  }
}
