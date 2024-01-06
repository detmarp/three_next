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
    this.edit.focus();

    this.doc.add('br');
    let sendButton = this.doc.add('button', 'Send');
    this.doc.onClick(sendButton, () => {
      let note = new Note(this.edit.value);
      this.program.send(note);
    });
    let clearButton = this.doc.add('button', 'Clear');
    this.doc.onClick(clearButton, () => {
      this.edit.value = '';
      this.edit.focus();
    });
  }
}
