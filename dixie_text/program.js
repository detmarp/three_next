import Tabber from './tabber.js';
import Persist from './persist.js';
import Settings from './settings.js';
import MainPage from './mainpage.js';
import SettingsPage from './settingspage.js';

export default class Program {
  constructor() {
    this.persist = new Persist('dixie_text');
    this.settings = new Settings(this.persist);
  }

  run() {
    const header = document.createElement('h2');
    header.textContent = 'Dixie text';
    document.body.appendChild(header);

    const tabContainer = document.body;
    const tabs = new Tabber(tabContainer, (selectedTabName) => {
      this.settings.setTab(tabs.index);
    });

    tabs.addTab("Main", (parent) => {
      let page = new MainPage(parent, this);
      page.make();
    });

    tabs.addTab("Settings", (parent) => {
      let page = new SettingsPage(parent, this.settings);
      page.make();
    });

    tabs.selectTab(this.settings.tab);
  }
}
