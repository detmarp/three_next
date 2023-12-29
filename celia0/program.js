import Doc from './d/doc.js';
import Note from './note.js';

export default class Program {
  constructor(root) {
    this.root = root;
    this.count = 0;
  }

  setup() {
    this.doc = new Doc(this.root);

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

    this.doc.add('h2', 'TODO');
    let todo = this.doc.add('ul');
    this.doc.add('li', '[/] Make a new journal repo', todo);
    this.doc.add('li', '[/] Fetch button', todo);
    this.doc.add('li', '[/] ...raw fetch', todo);
    this.doc.add('li', '[ ] Fetch a real list, some kind of formatting?', todo);
    this.doc.add('li', '[ ] handle all fetch error cases', todo);
    this.doc.add('li', '[ ] Create new file', todo);
    this.doc.add('li', '[ ] auth?', todo);
  }

  click(message) {
    this.doc.clear(this.messageArea);
    this.doc.add('text', message, this.messageArea);
  }

  async fetch() {
    // Fetch the repo contents
    let s = 'ccc';
    let response;

    let url = 'https://api.github.com/repos/detmarp/notebook/git/trees/main?recursive=1';
    await fetch(url)
    .then(response => response.text())
    .then((text) => {
      if (true) {
      s = 'bbb ' + text;
      }
      else {
      s = 'ddd ' + text;
      }

    })
    .catch(err => {
      s = 'aaa err: ' + err;
      //this.report(err, this.listArea);
    });
    this.report(s, this.listArea);
  }

  report(text, parent) {
    this.doc.clear(parent);
    this.doc.add('text', text, parent);
  }

  async send(note) {
    const content = note.text;
    const owner = 'detmarp';
    const repo = 'notebook';
    const path = `pages/${note.getFolder()}/${note.getFilename()}`;
    const message = `${note.getMessage()}`;
    const auth = 'x'; // try 3, fine-grained

    const existingFile = await (await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${auth}`
        }
      }
    )).json();

    await (await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `token ${auth}`
        },
        body: JSON.stringify({
          message: message,
          content: btoa(content),
          sha: existingFile.sha,
        }),
      }
    )).json();
  }

  run() {
    this.setup();
  }
}
