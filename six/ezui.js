export class EzUi {
  // A simple html UI overlay.

  constructor() {
    let head = document.head;
    let style = document.createElement('style');
    head.append(style);
    style.append(document.createTextNode(
      '.ezui {position: absolute; margin: 1rem;}'
    ));

    this.div = document.createElement('div');
    this.div.className = 'ezui';
    document.body.prepend(this.div);
  }

  addButton(label, callback) {
    let button = document.createElement('button');
    this.div.appendChild(button);
    button.innerHTML = label;
    button.onclick = callback;
    return button;
  }

  addText(text) {
    let div = document.createElement('div');
    this.div.appendChild(div);
    div.innerHTML = text;
    div.style.color = 'white';
    return div;
  }

  updateText(element, text) {
    element.innerHTML = text;
  }
}
