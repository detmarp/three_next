export default class Program {
  constructor() {
    this.makeOuter();
    this.makeInner1();
    this.makeInnerContents();
    this.makeFlexArea();
  }

  run() {
  }

  makeOuter() {
    /* make an outer div. We want it to fill the view window. */
    this.outer = document.createElement('div');
    this.outer.classList.add('dixie-outer');
    document.body.appendChild(this.outer);
  }

  makeFlexArea() {
    this.textBlock = document.createElement('div');
    this.textBlock.className = 'text-block';
    // Update this.textBlock to preserve newlines
    this.textBlock.style.whiteSpace = 'pre-line';
    this.textBlock.style.border = '1px solid black';
    this.setTextScroll(this.checkFlex.checked);

    // Create the slider element
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 50;
    slider.style.width = '100%'; // Set width to 100% of container width
    slider.style.maxWidth = '400px'; // Set max-w

    this.setBottomTextContents(slider.value);


    // Add an event listener for the slider
    let self = this;
    slider.addEventListener('input', function () {
      const value = parseInt(this.value);
      self.setBottomTextContents(value);
    });

    // Append the slider to the container
    this.outer.appendChild(slider);

    // Append the text element to the container
    this.outer.appendChild(this.textBlock);
  }

  makeInnerContents() {
    /* Controls for the top half of the display */

    /* Some header text */
    const header = document.createElement('h2');
    header.textContent = 'Dixie basic';
    this.inner1.appendChild(header);

    const p1 = document.createElement('p');
    p1.textContent = 'OK. This a simple page. With a few goals.  First, for display we want a tall orientation, even on wide screens. Second, we want an optional way of doing vertical overflow. Option A is that the rect expands vertically.  Option B is that the rect does not expand, but it allows for some element within it to have its own internal scroll Bar.';
    this.inner1.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'Second, I want a few basic controls to look good on desktop, then secondarily on android firefox, then lastly on iPad safari.';
    this.inner1.appendChild(p2);

    /* A text area */
    const textBox = document.createElement('textarea');
    textBox.rows = 4;
    textBox.style.width = '100%';
    textBox.placeholder = 'Enter text here';
    textBox.style.resize = 'vertical'; // Make the text box resizable
    this.inner1.appendChild(textBox);

    /* Add ands Clear buttons for the text area */
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => {
      let currentText = textBox.value;
      currentText += `Length was ${textBox.value.length}. Appending...\n`;
      textBox.value = currentText;
      textBox.scrollTop = 9999999;
    });
    this.inner1.appendChild(addButton);

    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', () => {
      textBox.value='';
    });
    this.inner1.appendChild(clearButton);

    const divider = document.createElement('hr');
    this.inner1.appendChild(divider);

    /* A checbox to control the flex property of the bottom part */
    this.checkFlex = document.createElement('input');
    this.checkFlex.type = 'checkbox';
    this.checkFlex.id = 'fooCheckbox';
    this.checkFlex.checked = true;
    const label = document.createElement('label');
    label.htmlFor = 'fooCheckbox';
    label.textContent = 'Use flex for lower text';

    let self = this;
    this.checkFlex.addEventListener('change', function () {
      self.setTextScroll(this.checked);
    });

    this.inner1.appendChild(this.checkFlex);
    this.inner1.appendChild(label);
  }

  makeInner1() {
    /* A div for the top half, so that its contents don't flex */
    this.inner1 = document.createElement('div');
    this.outer.appendChild(this.inner1);
  }

  setBottomTextContents(lines) {
    /* set N lines of text for the bottom text area */
    const linesArray = Array.from({ length: lines }, (_, index) => `Line ${index + 1} of ${lines}`);
    this.textBlock.textContent = linesArray.join('\n');
  }

  setTextScroll(scroll) {
    /* Set the flex behavior of the bottom text area */
    this.textBlock.classList.toggle('dixie-flex', scroll);
    this.outer.classList.toggle('dixie-outer-flex', scroll);
  }

}
