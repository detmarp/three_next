function element(type, text, parent) {
  let e = document.createElement(type);
  if (text) {
    e.textContent = text;
  }
  if (parent) {
    parent.appendChild(e)
  }
}

export default class MainPage {
  constructor(parentElement, program) {
    this.parentElement = parentElement;
    this.program = program;
  }

  make() {
    const labels = [
      'body', 'foo', 'bar'
    ];

    for (let label of labels) {
      let text = '' + this.program.settings.persist.get(label);
      text = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      element(
        'div',
        `${label}: ${text}`,
        this.parentElement
      );
    }
  }
}