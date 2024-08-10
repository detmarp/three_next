import Dixie from "../dixie/dixie.js";

export default class UiAiPage {
  constructor(parent) {
    this.element = document.createElement('div');
    if (parent) {
      parent.appendChild(this.element);
    }

    this.reset();
  }

  reset() {
    this.element.innerHTML = '';
    Dixie.makeButton(this.element, 'Foo', () => {this.addx()});
    Dixie.element('div', this.element);
    Dixie.makeButton(this.element, 'Test');
    Dixie.element('div', this.element);
    Dixie.makeButton(this.element, 'Test bad key');
    Dixie.element('div', this.element);
    Dixie.makeButton(this.element, 'Test bad url');
    Dixie.element('div', this.element);
    Dixie.makeButton(this.element, 'Test bad endopoint');
    Dixie.element('div', this.element);
    Dixie.makeButton(this.element, 'Test with error and delay');
    //Dixie.element('div', this.element, 'Cancel button');
    //Dixie.element('div', this.element, 'Grey out buttons while waiting?');
    //Dixie.element('div', this.element, 'error value of response');
    //Dixie.element('div', this.element, 'text of response');
    //Dixie.element('div', this.element, 'full json of response?');
    Dixie.element('p', this.element);
    Dixie.makeButton(this.element, 'Reset', () => {this.reset()});
  }

  addx() {
    Dixie.element('hr', this.element);
    this.makeText();
    Dixie.element('p', this.element);
    this.makeText();
  }

  makeText() {
    const element = document.createElement('pre');
    this.element.appendChild(element);
    element.textContent = 'asdfasdfasdf\nasdfasdf\n\n';
    //element.contentEditable = 'true';
    element.readOnly = true;
    element.style.userSelect = 'text';
    element.style.fontFamily = 'monospace';
    element.style.border = '1px solid gray';
    return element;
  }

}
