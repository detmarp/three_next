import Openai from './openai.js'; // Import the Openai class from openai.js

function element(type, text, parent) {
  let e = document.createElement(type);
  if (text) {
    e.textContent = text;
  }
  if (parent) {
    parent.appendChild(e);
  }
  return e;
}

export default class MainPage {
  constructor(parentElement, program) {
    this.parentElement = parentElement;
    this.program = program;
    this.textArea = null; // Field to store the read-only text area
    this.queryButton = null; // Field to store the 'Query' button
    this.cancelButton = null; // Field to store the 'Cancel' button
    this.clearButton = null; // Field to store the 'Clear' button
    this.querying = false; // Flag to track if a query is in progress
  }

  make() {
    // Create text setting element
    this.textSetting('apikey');

    // Create read-only text area and store it in the textArea field
    this.textArea = this.createReadOnlyTextArea();
    this.textArea.style.display = 'block'; // Ensure block-level display for vertical stacking

    // Create 'Query' button and store it in the queryButton field
    this.queryButton = this.createButton('Query', this.handleQuery.bind(this)); // Bind the method to maintain the correct 'this' context
    this.queryButton.style.display = 'block'; // Ensure block-level display for vertical stacking

    // Create 'Cancel' button and store it in the cancelButton field
    this.cancelButton = this.createButton('Cancel', this.handleCancel);
    this.cancelButton.style.display = 'block'; // Ensure block-level display for vertical stacking
    this.cancelButton.disabled = true; // Start with Cancel button disabled

    // Create 'Clear' button and store it in the clearButton field
    this.clearButton = this.createButton('Clear', this.handleClear.bind(this)); // Bind the method to maintain the correct 'this' context
    this.clearButton.style.display = 'block'; // Ensure block-level display for vertical stacking
  }

  textSetting(key) {
    let text = '' + this.program.settings.get(key);
    text = text.replace(/\n/g, '<br>').replace(/ /g, '&nbsp;');
    let e = element(
      'div',
      `${key}: ${text}`,
      this.parentElement
    );
    e.style.whiteSpace = 'pre-wrap';
    e.style.overflowWrap = 'break-word';
    e.style.display = 'block'; // Ensure block-level display for vertical stacking
    return e;
  }

  createReadOnlyTextArea() {
    let textArea = element('textarea');
    textArea.rows = 4; // Set the number of rows as needed
    textArea.cols = 50; // Set the number of columns as needed
    textArea.readOnly = true;
    textArea.style.resize = 'none';
    textArea.style.display = 'block'; // Ensure block-level display for vertical stacking
    this.parentElement.appendChild(textArea);
    return textArea; // Return the created text area element
  }

  createButton(text, clickHandler) {
    let button = element('button', text, this.parentElement);
    button.addEventListener('click', clickHandler);
    button.style.display = 'block'; // Ensure block-level display for vertical stacking
    return button; // Return the created button element
  }

  handleQuery() {
    // Get the API key from this.program.settings
    const apiKey = this.program.settings.get('apikey');

    if (!apiKey) {
      console.error('API key not found.');
      return;
    }

    // Set querying flag to true
    this.querying = true;

    // Disable 'Query' button during query
    this.queryButton.disabled = true;

    // Enable 'Cancel' button during query
    this.cancelButton.disabled = false;

    // Create a new Openai object with the retrieved API key
    const openai = new Openai(apiKey);

    // Get the prompt or text you want to query from the user
    const prompt = 'Your prompt or text here'; // You can replace this with dynamic input or logic to get the prompt

    // Call the query method of the Openai object to send a query to the OpenAI API
    openai.completions('hey')
    //openai.query(prompt)
      .then(data => {
        // Update the textArea element with the returned text from the OpenAI API
        this.textArea.value = 'good';//data.choices[0].text; // Assuming data is in JSON format and the returned text is in data.choices[0].text
      })
      .catch(error => {
        console.error('Error querying OpenAI API:', error);
        // Update the textArea element with the error message
        this.textArea.value = `Error: ${error.message}`; // Display the error message in the text area
      })
      .finally(() => {
        // Set querying flag back to false after query completion
        this.querying = false;

        // Enable 'Query' button after query completes (whether success or error)
        this.queryButton.disabled = false;

        // Disable 'Cancel' button after query completes (whether success or error)
        this.cancelButton.disabled = true;
      });
  }

  handleCancel() {
    // Handle cancel button click event here
  }

  handleClear() {
    // Clear the textArea content
    this.textArea.value = '';
  }
}
