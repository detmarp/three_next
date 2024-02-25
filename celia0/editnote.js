import Note from './note2.js';

export default class EditNote {
  constructor() {
    this.note = new Note();
  }

  getPath() { 
    return this.note.getPath();
  }

  getMessage() { 
    return this.note.getMessage();
  }
}