export default class UiEmberPage {
  constructor(parent) {
    this.element = document.createElement('div');
    if (parent) {
      parent.appendChild(this.element);
    }

    this.element.textContent = 'This page shows the state of ember.';
  }
}
