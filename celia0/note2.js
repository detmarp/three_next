/* A single page or note or file.
*/

export default class Note {
  #text = '';
  #autotitle = '';
  #created = '';
  #createdUtc = '';
  #date = '';

  constructor() {
    this.setDates();
    this.text = '';
  }

  get text() { return this.#text; }
  get autotitle() { return this.#autotitle; }
  get created() { return this.#created; }
  get createdUtc() { return this.#createdUtc; }
  get date() { return this.#date; }

  set text(text) {
    this.#text = text;
    this.setDates();
    this.setTitle();
  }

  setDates() {
    let now = new Date();
    let offset = now.getTimezoneOffset() * 60 * 1000
    let local = new Date(now - offset)
    let iso = local.toISOString().split('.')[0];
    let utc = now.toISOString();
    this.#created = iso;
    this.#createdUtc = utc;
    this.#date = iso.substring(0, 10);
  }

  setTitle() {
    let name = `${this.created}`;
    name = name.replace('T', '_').replaceAll(':', '-');
    this.#autotitle = name;
  }

  toJson() {
    let ob = {
      autotitle: this.#autotitle,
      text: this.#text,
      date: this.#date,
      created: this.#created,
      createdUtc: this.#createdUtc,
    };
    return JSON.stringify(ob, null, 2);
  }

  // return a normalized note.
  format() {
    let text = this.#text;
    let post = '';
    let tagSet = new Set();
    let tags = [];

    // find hashtags, either on their own, or in a link.
    let patterns= [
      /\B\[#(\S+)\]\(.*\)+\s*/g,    // a markdown link, with hashtag text
      /\B#([A-Za-z0-9_\-\.]+)\s*/g, // a hashtag
    ];

    // remove hashtags from the text.
    for (let regex of patterns) {
      for (;;) {
        let match = regex.exec(text);
        if (!match) {
          break;
        }
        let capture = match[1];
        let count = 0;
        // Replace only the first match with an empty string
        text = text.replace(regex, (match) => {
          count += 1;
          return count === 1 ? '' : match;
        });
        if (!tagSet.has(capture)) {
          tags.push(capture);
          tagSet.add(capture);
        }
      }
    }

    // append hashtags to the end, as links.
    for (var tag of tags) {
      // normalize the hashtag
      let clean = tag.toLowerCase();
      clean = clean.replace(/[^a-z0-9]/g, '');
      if (clean.length == 0) {
        clean = '_';
      }
      post += `[#${clean}](../../pageindex.md#${clean})\n`;
    }

    text = text.trim();
    text = text + `\n\n${post}`;
    this.#text = text;
  }
}
