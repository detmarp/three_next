export default class Doc {
  constructor(root) {
    this.root = root ?? document.body;
  }

  add(tag, inner, parent) {
    let el = document.createElement(tag);
    if (inner) {
      el.innerHTML = inner;
    }
    parent = parent || this.root;
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  }

  onClick(button, callback) {
    button.addEventListener('click', callback);
  }

  clear(parent) {
    parent = parent || this.root;
    if (parent) {
      parent.replaceChildren();
    }
  }
}
