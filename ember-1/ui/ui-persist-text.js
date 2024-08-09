export default class UiPersistText {
  constructor(parent) {
    this.element = document.createElement('div');
    this.element.textContent = 'This is a text input element that automatically persists';
    if (parent) {
      parent.appendChild(this.element);
    }
  }
}
