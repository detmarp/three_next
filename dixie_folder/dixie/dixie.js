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

/**
   * Creates a fidget widget with placeholder controls and appends it to the specified parent element.
   *
   * @param {HTMLElement} parent - The parent element to which the fidget widget will be appended.
   */
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
