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
    this.textArea = null;
    this.queryButton = null;
    this.cancelButton = null;
    this.clearButton = null;
    this.querying = false;
  }

  make() {
    this.textArea = this.createReadOnlyTextArea();

    this.queryButton = this.createButton('Query', this.handleQuery.bind(this));

    this.cancelButton = this.createButton('Cancel', this.handleCancel);
    this.cancelButton.disabled = true;

    this.clearButton = this.createButton('Clear', this.handleClear.bind(this));
  }

  createReadOnlyTextArea() {
    let textArea = element('textarea', null, this.parentElement);
    textArea.style.minHeight = '16em';
    //textArea.readOnly = true;
    textArea.style.display = 'block';
    textArea.style.width = '100%';
    textArea.style.resize = 'vertical';
    return textArea;
  }

  createButton(text, clickHandler) {
    let button = element('button', text, this.parentElement);
    button.addEventListener('click', clickHandler);
    button.style.display = 'block';
    button.style.marginTop = '0.5em';
    return button;
  }

  handleQuery() {
    const apiKey = this.program.settings.get('apikey');

    if (!apiKey) {
      console.error('API key not found.');
      return;
    }

    this.querying = true;
    this.queryButton.disabled = true;
    this.cancelButton.disabled = false;

    const openai = new Openai(apiKey);

    const prompt = 'Your prompt or text here';

    openai.completions('hey')
      .then(data => {
        this.textArea.value = data;
      })
      .catch(error => {
        console.error('Error querying OpenAI API:', error);
        this.textArea.value = `Error: ${error.message}`;
      })
      .finally(() => {
        this.querying = false;
        this.queryButton.disabled = false;
        this.cancelButton.disabled = true;
      });
  }

  handleCancel() {
  }

  handleClear() {
    this.textArea.value = '';
  }
}
