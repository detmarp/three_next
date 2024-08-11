import Dixie from "../dixie/dixie.js";
import AiTest from "../ember/ai-test.js";
import XhrPost from "../ember/xhr-post.js";

export default class UiAiPage {
  constructor(parent, persist) {
    this.persist = persist;

    this.element = Dixie.element('div', parent);

    this.reset();
  }

  reset() {
    this.aiTest = null;
    this.element.innerHTML = '';

    this.addGroup(Dixie.makeButton(this.element, 'Test no URL', () => {this.testNoUrl()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test badly formed URL', () => {this.testBadUrl()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test badly formed URL 2', () => {this.testBadUrl2()}));
    Dixie.element('div', this.element);
    this.addGroup(Dixie.makeButton(this.element, 'Test bad endpoint', () => {this.testBadEndpoint()}));
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
    this.topEnd = Dixie.element('span', this.element);
    this.resultDiv = Dixie.element('div', this.element);
    this.resultElements = null;
    this.resultA = null;
    this.resultB = null;
  }

  begin() {
    this.setGroup(false);
    Dixie.makeButton(this.topEnd, '...', () => {this.abort()});
  }

  abort() {
    if (this.aiTest) {
      this.aiTest.controller.abort();
    }
  }

  result(data) {
    this.setGroup(true);
    this.topEnd.innerHTML = '';
    if (!this.resultElements) {
      this.resultElements = Dixie.element('hr', this.element);
      this.resultA = this.makeText();
      Dixie.element('p', this.element);
      this.resultB = this.makeText();
    }

    let cleanString = function (s) {
      s = s ?? '[null]';
      if (typeof s!=='string') {
        s = JSON.stringify(s);
      }
      return s;
    };


    this.resultA.innerText = cleanString(data.content);
    this.resultB.innerText = cleanString(data.response);
  }

  testNoUrl() {
    this.begin();
    let xhr = new XhrPost();
    xhr.send(x => {this.result(x)});
  }

  testBadUrl() {
    this.begin();
    let xhr = new XhrPost('this bad url might be treated as a local resource');
    xhr.send(x => {this.result(x)});
  }

  testBadUrl2() {
    this.begin();
    let xhr = new XhrPost('https://293847465.29347847494.ghtry');
    xhr.send(x => {this.result(x)});
  }

  testBadEndpoint() {
    this.begin();
    let xhr = new XhrPost('https://api.openai.com/notarealendpoint');
    xhr.send(x => {this.result(x)});
  }

  test() {
    this.begin();
    let xhr = new XhrPost('https://api.openai.com/v1/chat/completions');
    xhr.hackApiKey = this.persist.get('apikey');
    xhr.send(x => {this.result(x)});
  }

  testBadKey() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'testBadKey');
  }

  testErrorDelay() {
    this.setGroup(false);
    Dixie.element('div', this.element, 'testErrorDelay');
  }

  makeText() {
    const element = document.createElement('pre');
    this.element.appendChild(element);
    element.textContent = 'asdfasdfasdf\nasdfasdf\n\n';
    element.readOnly = true;
    element.style.userSelect = 'text';
    element.style.fontFamily = 'monospace';
    element.style.border = '1px solid gray';
    element.style.whiteSpace = 'pre-wrap';
    element.style.overflowWrap = 'break-word';
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
