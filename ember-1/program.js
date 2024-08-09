import Dixie from './dixie/dixie.js';
import DixieTabs from './dixie/dixie-tabs.js';
import UiMainPage from './ui/ui-main-page.js';
import UiSettingsPage from './ui/ui-settings-page.js';
import BeePersist from './bee/bee-persist.js';

export default class Program {
  constructor() {
    this.persist = new BeePersist('ember-1');

    const outer = Dixie.makeOuter();

    const header = document.createElement('h2');
    header.textContent = 'Ember 1';
    outer.appendChild(header);

    const p1 = document.createElement('p');
    p1.textContent = 'Hi.';
    outer.appendChild(p1);

    this.makeTabs(outer);
  }

  makeTabs(outer) {
    let tabs = new DixieTabs(outer);

    let mainTab = tabs.addTab('Main');
    new UiMainPage(mainTab);

    let tab2 = tabs.addTab('two');
    Dixie.makeFidgetWidget(tab2, 'two');

    let settingsTab = tabs.addTab('Settings');
    new UiSettingsPage(settingsTab);

    // Persist the current tab
    tabs.selectTab(this.persist.getInt('tab'));
    tabs.onSelected = () => {
      this.persist.set('tab', tabs.index);
    };
  }

  run() {
  }
}
