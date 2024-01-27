import Doc from './d/doc.js';
import Note from './note.js';

export default class PageCompose {
  constructor(parent, program) {
    this.parent = parent;
    this.program = program;
    this.doc = new Doc(this.parent);

    this.edit = this.doc.add('textarea');
    this.edit.setAttribute('cols', '40');
    this.edit.setAttribute('rows', '10');
    this.edit.addEventListener('input', (e) => this.onChange());
    // Prevent unwanted capitlization, etc.
    // Just guessing at alot of this.
    // DIesn't really do what I want. oh well.
    this.edit.autocomplete = 'off';
    this.edit.ariaInvalid = 'false';
    this.edit.ariaHaspopup = 'false';
    this.edit.spellcheck = 'false';

    this.doc.add('br');
    this.buttonArea = this.doc.add('div');

    this.doc.add('br');
    this.messageArea = this.doc.add('div');

    this.doc.add('br');
    this.debugArea = this.doc.add('div');

    this.onStart();
  }

  onStart() {
    this.clearButtons();
    this.saveButton = this.addButton('Save', () => this.onSaveButton());

    this.edit.disabled = false;
    this.edit.focus();

    this.onChange();
  }

  clearButtons() {
    this.doc.clear(this.buttonArea);
  }

  addButton(label, onClick) {
    let button = this.doc.add('button', label, this.buttonArea);
    this.doc.onClick(button, onClick);
    return button;
  }

  onChange() {
    let white = this.edit.value.trim().length === 0;
    if(this.saveButton) {
      this.saveButton.disabled = white;
    }
    this.updateDebug();
  }

  async onSaveButton() {
    this.doc.clear(this.messageArea);
    let note = new Note(this.edit.value);
    this.saveButton.disabled = true;
    this.edit.disabled = true;
    try {
      await this.program.send(note);
      this.onSaved();
    }
    catch(e) {
      this.onError(e.message);
    }
  }

  onError(error) {
    this.doc.clear(this.messageArea);
    this.doc.add('text', error, this.messageArea);
    this.clearButtons();
    this.saveButton = this.addButton('Retry', () => this.onSaveButton());
  }

  onSaved() {
    this.doc.clear(this.messageArea);
    this.addButton('Clear', () => this.onClearButton());
  }

  onClearButton() {
    this.edit.value = '';
    this.onStart();
  }

  updateDebug() {
    this.doc.clear(this.debugArea);
    let note = new Note(this.edit.value);
    this.doc.add('text', note.toJson(), this.debugArea);
  }
}
