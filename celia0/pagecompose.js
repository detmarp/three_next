import Doc from './d/doc.js';
import Note from './note.js';
import EditNote from './editnote.js';
import Format from './format.js';

export default class PageCompose {
  constructor(parent, program) {
    this.parent = parent;
    this.program = program;
    this.doc = new Doc(this.parent);

    this.editNote = new EditNote();

    this.doc.add('text', ' Title');
    this.title = this.doc.add('input');
    this.title.placeholder = this.editNote.note.autotitle;
    this.title.addEventListener('input', (e) => this.onTitle());
    this.doc.add('text', '[test: ');
    this.testmode = this.doc.add('input');
    this.testmode.checked = this.program.settings.testmode === 'true';
    this.testmode.type = 'checkbox';
    this.doc.add('text', ']');

    this.doc.add('br');
    this.edit = this.doc.add('textarea');
    this.edit.setAttribute('cols', '40');
    this.edit.setAttribute('rows', '12');
    this.edit.addEventListener('input', (e) => this.onChange());
    // Prevent unwanted capitlization, etc.
    // Just guessing at alot of this.
    // Doesn't really do what I want. oh well.
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
    this.formatButton = this.addButton('Format', () => this.onFormatButton());
    this.undoFormat = null;

    this.edit.disabled = false;
    this.edit.focus();

    this.onChange();
  }

  clearButtons() {
    this.doc.clear(this.buttonArea);
    this.formatButton = null;
  }

  addButton(label, onClick) {
    let button = this.doc.add('button', label, this.buttonArea);
    this.doc.onClick(button, onClick);
    return button;
  }

  onTitle() {
    // Title text changed
    this.updateDebug();
  }

  onChange() {
    let white = this.edit.value.trim().length === 0;
    if(this.saveButton) {
      this.saveButton.disabled = white;
    }
    if (this.formatButton) {
      this.formatButton.disabled = white;
      this.undoFormat = null;
      this.formatButton.textContent = 'Format';
    }

    this.editNote.note.text = this.edit.value;
    this.updateDebug();
  }

  async onSaveButton() {
    this.doc.clear(this.messageArea);
    this.saveButton.disabled = true;
    this.edit.disabled = true;

    try {
      await this.program.send(
        this.editNote.note.text,
        this.getPath(),
        'message'
      );
      this.onSaved();
    }
    catch(e) {
      this.onError(e.message);
    }
  }

  getPath() {
    return `pages/${this.getFolder()}/${this.getFilename()}`;
  }

  getFolder() {
    let folder = this.editNote.note.date.substring(0,7);
    return folder
  }

  getFilename() {
    let title = this.title.value;
    let filename = title.trim();
    if (Format.isBlank(filename)) {
      filename = this.editNote.note.autotitle;
    }
    filename = filename + '.md';
    return filename;
  }
    
  onFormatButton() {
    if (this.undoFormat) {
      this.edit.value = this.undoFormat;
      this.undoFormat = null;
      this.formatButton.textContent = 'Format';
      return
    }

    // Format the note.
    let note = new Note(
      this.edit.value,
      this.autotitle.checked ? null : this.title.value
    );
    note.format();

    let oldValue = this.edit.value;
    this.edit.value = note.format();
    this.onChange();

    this.formatButton.textContent = 'Undo Format';
    this.undoFormat = oldValue;
  }

  onError(error) {
    this.doc.clear(this.messageArea);
    this.doc.add('text', error, this.messageArea);
    this.clearButtons();
    this.saveButton = this.addButton('Retry', () => this.onSaveButton());
  }

  onSaved() {
    this.doc.clear(this.messageArea);
    this.doc.add('text', 'Saved', this.messageArea);
    this.addButton('Clear', () => this.onClearButton());
  }

  onClearButton() {
    this.edit.value = '';
    this.title.value = '';
    this.onStart();
  }

  updateDebug() {
    this.doc.clear(this.debugArea);
    this.doc.add('text',
      `${this.getPath()}<br><br>${this.editNote.note.toJson()}`,
      this.debugArea
    );
  }
}
