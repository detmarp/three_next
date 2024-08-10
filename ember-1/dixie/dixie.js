export default class Dixie {
  /**
   * Creates a new div element with the class 'dixie-outer' and appends it to the specified parent element.
   * If no parent element is provided, the div is appended to the document body.
   *
   * @param {HTMLElement} [parent=document] - The parent element to which the new div will be appended.
   * @returns {HTMLElement} The newly created div element with the class 'dixie-outer'.
   */
  static makeOuter(parent = document.body) {
      const outer = document.createElement('div');
      outer.classList.add('dixie-outer');
      parent.appendChild(outer);
      return outer;
  }

static element(tag, parent, textContent) {
  const el = document.createElement(tag);
  if (parent) {
    parent.appendChild(el);
  }
  if (textContent) {
    el.textContent = textContent;
  }
  return el;
}

static makeTextWidget(parent, text = 'Placeholder text') {
  const el = document.createElement('p');
  el.textContent = text;

  if (parent) {
    parent.appendChild(el);
  }

  return el;
}

static makeButton(parent, label = 'Button', onClick) {
  const button = document.createElement('button');
  if (parent) {
    parent.appendChild(button);
  }
  button.textContent = label;
  button.addEventListener('click', onClick);
  return  button;
}

static makeFidgetWidget(parent, title = 'Fidget Widget') {
  const widget = document.createElement('div');
  widget.classList.add('fidget-widget');

  // Title
  const titleElement = document.createElement('h3');
  titleElement.textContent = title;
  widget.appendChild(titleElement);

  // Text
  const text = document.createElement('p');
  text.textContent = 'This is some placeholder text.';
  widget.appendChild(text);

  // Value
  const valueDisplay = document.createElement('span');
  valueDisplay.textContent = '0';
  widget.appendChild(valueDisplay);

  // Increment button
  const incrementBtn = document.createElement('button');
  incrementBtn.textContent = '+';
  incrementBtn.addEventListener('click', () => {
    const currentValue = parseInt(valueDisplay.textContent, 10);
    valueDisplay.textContent = currentValue + 1;
  });
  widget.appendChild(incrementBtn);

  // Reset button
  const resetBtn = document.createElement('button');
  resetBtn.textContent = 'Reset';
  resetBtn.addEventListener('click', () => {
    valueDisplay.textContent = '0';
  });
  widget.appendChild(resetBtn);

  parent.appendChild(widget);
}
}
