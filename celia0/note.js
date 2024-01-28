/* A single page or note or file.
*/

export default class Note {
  constructor(text) {
    this.text = text ?? '';
    this.setCreated();
    this.setTitle();
  }

  /* Create a mock note, for testing */
  mock() {
    this.setCreated();

    this.text = `#Note
#testing

This is a note.

local : ${this.created}

utc: ${this.createdUtc}

Here is the note.
`;

    this.setTitle();
  }

  getTitle() {
    return 'This is the title of this note';
  }

  setTitle() {
    this.title = this.getTitle();
  }

  setCreated() {
    let now = new Date();
    let offset = now.getTimezoneOffset() * 60 * 1000
    let local = new Date(now - offset)
    let iso = local.toISOString().split('.')[0];
    let utc = now.toISOString();
    this.created = iso;
    this.createdUtc = utc;
  }

  // Return a possible filename for this note.
  getFilename() {
    let name = `${this.created}.md`;
    name = name.replace('T', '_').replaceAll(':', '-');
    return name;
  }

  // Return a possible folder for this note.
  getFolder() {
    return 'testing';
    //return `${this.created.substring(0, 7)}`
  }

  // Return a possible commit message for this note.
  getMessage(device = null) {
    let text = `Note for ${this.created}`;
    if (device) {
      text += ` from ${device}`;
    }
    return text;
  }

  toJson() {
    let ob = {
      title: this.title,
      text: this.text,
      created: this.created,
      createdUtc: this.createdUtc,
    };
    return JSON.stringify(ob, null, 2);
  }
}
