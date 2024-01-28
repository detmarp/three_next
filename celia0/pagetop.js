import Doc from './d/doc.js';
import TabMaker from './d/tabmaker.js';
import PageCompose from './pagecompose.js';
import PageSettings from './pagesettings.js';
import PageLinks from './pagelinks.js';

export default class PageTop {
  constructor(parent, program) {
    this.parent = parent;
    this.program = program;

    this.doc = new Doc(this.parent);

    this.doc.add('br');
    this.header = this.doc.add('div');

    this.tabMaker = new TabMaker(this.header);

    new PageCompose(this.tabMaker.add('Compose'), this.program);
    new PageSettings(this.tabMaker.add('Settings'), this.program.settings);
    new PageLinks(this.tabMaker.add('Links'), this.parent);
  }
}
