export default class Program {
  constructor() {
    this.makeOuter();
  }

  makeOuter() {
    this.div = document.createElement('div');
    this.div.classList.add('dixie-outer');
    document.body.appendChild(this.div);
  }
  run() {


    const header = document.createElement('h2');
    header.textContent = 'Dixie basic';
    this.div.appendChild(header);

    const p1 = document.createElement('p');
    p1.textContent = 'OK. This a simple page. With a few goals.  First, for display we want a tall orientation, even on wide screens. Second, we want an optional way of doing vertical overflow. Option A is that the rect expands vertically.  Option B is that the rect does not expand, but it allows for some element within it to have its own internal scroll Bar.';
    this.div.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'Second, I want a few basic controls to look good on desktop, then secondarily on android firefox, then lastly on iPad safari.';
    this.div.appendChild(p2);

    // Create the text input box
    const div2 = document.createElement('div');
    this.div.appendChild(div2);
    const textBox = document.createElement('textarea');
    textBox.rows = 4;
    textBox.style.width = '100%';
    textBox.placeholder = 'Enter text here';
    textBox.style.resize = 'vertical'; // Make the text box resizable
    div2.appendChild(textBox);

    // Create the "Add" button
    const addButton = document.createElement('button');
    addButton.textContent = 'Add';
    addButton.addEventListener('click', () => {
      // Empty callback function
    });
    this.div.appendChild(addButton);

    // Create the "Clear" button
    const clearButton = document.createElement('button');
    clearButton.textContent = 'Clear';
    clearButton.addEventListener('click', () => {
      // Empty callback function
    });
    this.div.appendChild(clearButton);

    // Create the horizontal divider
    const divider = document.createElement('hr');
    this.div.appendChild(divider);
    // Create the checkbox element
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'fooCheckbox';
    checkbox.checked = true;
    const label = document.createElement('label');
    label.htmlFor = 'fooCheckbox';
    label.textContent = 'Foo me';

    let self = this;
    // Add an event listener for the checkbox
    checkbox.addEventListener('change', function () {
      self.setTextScroll(this.checked);
    });

    // Append the checkbox to the container
    this.div.appendChild(checkbox);
    this.div.appendChild(label);

    // Create the text element
    const textElement = document.createElement('div');
    textElement.textContent = 'hi';
    this.div.appendChild(textElement);

    this.textBlock = document.createElement('div');
    this.textBlock.className = 'text-block';
// Update this.textBlock to preserve newlines
this.textBlock.style.whiteSpace = 'pre-line';
    this.textBlock.style.border = '1px solid black';
this.setTextScroll(checkbox.checked);

    // Create the slider element
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = 5;
    slider.style.width = '100%'; // Set width to 100% of container width
    slider.style.maxWidth = '400px'; // Set max-w

  this.setTextContents(slider.value);


    // Add an event listener for the slider
    slider.addEventListener('input', function () {
      const value = parseInt(this.value);
      self.setTextContents(value);
    });

    // Append the slider to the container
    this.div.appendChild(slider);

    // Append the text element to the container
    this.div.appendChild(this.textBlock);
  }

  // Define the setTextBlock function
  setTextContents(lines) {
    const linesArray = Array.from({ length: lines }, (_, index) => `Line ${index + 1} of ${lines}`);
    this.textBlock.textContent = linesArray.join('\n');
  }

  setTextScroll(scroll) {
    this.textBlock.classList.toggle('dixie-flex', scroll);
    this.div.classList.toggle('dixie-outer-flex', scroll);
  }

}
