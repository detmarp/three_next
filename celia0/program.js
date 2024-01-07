import Doc from './d/doc.js';
import Persist from './d/persist.js';
import Note from './note.js';
import Settings from './settings.js';
import Github from './github.js';
import PageTop from './pagetop.js';

export default class Program {
  constructor(root) {
    this.root = root;
    this.count = 0;
    this.persist = new Persist('celia0');
  }

  setup() {
    this.settings = new Settings(this.persist);
    this.github = new Github('detmarp', 'notebook', this.settings.authToken);

    this.doc = new Doc(this.root);
    this.topPage = new PageTop(this.root, this);
    return;

    let self = this;

    // Edit
    this.doc.add('h2', 'Edit');
    this.edit = this.doc.add('textarea');
    this.edit.setAttribute('cols', '40');
    this.edit.setAttribute('rows', '10');
    this.edit.focus();

    this.doc.add('br');
    let sendButton = this.doc.add('button', 'Send');
    this.doc.onClick(sendButton, () => {
      let note = new Note(this.edit.value);
      self.send(note);
    });
    let clearButton = this.doc.add('button', 'Clear');
    this.doc.onClick(clearButton, () => {
      this.edit.value = '';
      this.edit.focus();
    });

    // test buttons
    this.doc.add('h2', 'Test buttons');
    let fetch = this.doc.add('button', 'Fetch');
    this.doc.onClick(fetch, () => { self.fetch(); });

    this.doc.add('br');

    let send = this.doc.add('button', 'Send');
    this.doc.onClick(send, () => {
      let note = new Note();
      note.mock();
      this.send(note);
    });

    // listing
    this.doc.add('h2', 'Listing');
    this.listArea = this.doc.add('p');

    this.doc.add('h2', 'Upload');
    this.sendArea = this.doc.add('p');

    // settings
    this.doc.add('h2', 'Settings');
    let settingsDiv = this.doc.add('div');
    this.settings = new Settings(this.persist);
    this.settings.addTo(settingsDiv);

    // github api
    this.github = new Github('detmarp', 'notebook', this.settings.authToken);
  }

  click(message) {
    this.doc.clear(this.messageArea);
    this.doc.add('text', message, this.messageArea);
  }

  async fetch() {
    // Fetch the repo contents
    let s = await this.github.trees();
    this.report(s, this.listArea);
  }

  report(text, parent) {
    this.doc.clear(parent);
    this.doc.add('text', text, parent);
  }

  async send(note) {
    const content = note.text;
    const path = `pages/${note.getFolder()}/${note.getFilename()}`;
    const message = `${note.getMessage()}`;

    let existingFile = this.github.get(path);
    await this.github.put(content, path, message, existingFile.sha);
  }

  run() {
    this.setup();
  }
}
