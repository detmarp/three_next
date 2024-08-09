export default class UiMainPage {
  constructor(parent) {
    this.element = document.createElement('div');
    if (parent) {
      parent.appendChild(this.element);
    }

    this.element.textContent = 'This is the main page, where we do our basic Ember operations, saying hi, pinging ember, asking questions.';
  }
}
