function element(type, text, parent) {
  let e = document.createElement(type);
  if (text) {
    e.textContent = text;
  }
  if (parent) {
    parent.appendChild(e)
  }
  return e;
}

export default class MainPage {
  constructor(parentElement, program) {
    this.parentElement = parentElement;
    this.program = program;
  }

  make() {
    const labels = [
      'body', 'foo', 'bar', 'tab',
    ];

    for (let label of labels) {
      let text = '' + this.program.settings[label];
      text = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
      let e = element(
        'div',
        `${label}: ${text}`,
        this.parentElement
      );
      e.style.whiteSpace = 'pre-wrap';
      e.style.overflowWrap = 'break-word';
    }
  }
}