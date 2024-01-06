import Doc from './d/doc.js';
import TabMaker from './d/tabmaker.js';
import PageCompose from './pagecompose.js';
import PageSettings from './pagesettings.js';
import PageBlank from './pageblank.js';

export default class PageTop {
  constructor(parent, program) {
    this.parent = parent;
    this.program = program;
    this.tabMaker = new TabMaker(this.parent);
    this.doc = new Doc(this.parent);

    new PageCompose(this.tabMaker.add('Compose'), this.program);
    new PageSettings(this.tabMaker.add('Settings'), this.program.settings);
    new PageBlank(this.tabMaker.add('x'));
    new PageBlank(this.tabMaker.add('x'));
  }
}
