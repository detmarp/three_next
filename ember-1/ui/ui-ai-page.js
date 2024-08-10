import Dixie from "../dixie/dixie.js";
import AiTest from "../ember/ai-test.js";

export default class UiAiPage {
  constructor(parent) {
    this.element = document.createElement('div');
    if (parent) {
      parent.appendChild(this.element);
    }

    this.reset();
  }

  reset() {
    this.aiTest = null;
    this.element.innerHTML = '';

    this.addGroup(Dixie.makeButton(this.element, 'Foo', () => {this.foo()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test', () => {this.test()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test bad key', () => {this.testBadKey()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test bad url', () => {this.testBadUrl()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test bad endpoint', () => {this.testBadEndpoint()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test with error and delay', () => {this.testErrorDelay()}));
    Dixie.element('p', this.element);
    Dixie.makeButton(this.element, 'Reset', () => {this.reset()});
    this.topEnd = Dixie.element('div', this.element);
    this.resultDiv = Dixie.element('div', this.element);
  }

  begin() {
    this.setGroup(false);
    this.aiTest = new AiTest();
    this.aiTest.foo(x => {this.result(x)});
    Dixie.makeButton(this.topEnd, '...\u2b1b', () => {this.abort()});
  }

  abort() {
    if (this.aiTest) {
      this.aiTest.controller.abort();
      this.aiTest = null;
      this.reset();
    }
  }

  result(data) {
    this.setGroup(true);
    this.topEnd.innerHTML = '';
    Dixie.element('hr', this.element);
    let a = this.makeText();
    Dixie.element('p', this.element);
    let b = this.makeText();
    a.innerText = 'aaa\nbbb';
    b.innerText = 'ccc\nddd';
  }

  foo() {
    this.begin()
  }

  test() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'test');
  }

  testBadKey() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'testBadKey');
  }

  testBadUrl() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'testBadUrl');
  }

  testBadEndpoint() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'testBadEndpoint');
  }
  testErrorDelay() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'testErrorDelay');
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

  addGroup(element) {
    element.classList.add('group');
  }

  setGroup(enabled) {
    const groups = this.element.getElementsByClassName('group');
    for (let i = 0; i < groups.length; i++) {
      groups[i].disabled =!enabled;
    }
  }
}
