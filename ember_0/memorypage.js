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
    element('p', 'memory page', this.parentElement);
  }
}
