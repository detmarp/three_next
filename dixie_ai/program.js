import Tabber from './tabber.js';
import Persist from './persist.js';
import Settings from './settings.js';
import MainPage from './mainpage.js';
import SettingsPage from './settingspage.js';

export default class Program {
  constructor() {
    this.persist = new Persist('dixie_text');
    const defaults = {
      'apikey': '',
    }
    this.settings = new Settings(this.persist, defaults);
  }

  run() {
    const header = document.createElement('h2');
    header.textContent = 'Dixie AI';
    document.body.appendChild(header);

    const tabContainer = document.body;
    const tabs = new Tabber(tabContainer);

    tabs.addTab("Main", (parent) => {
      let page = new MainPage(parent, this);
      page.make();
    });

    tabs.addTab("Settings", (parent) => {
      let page = new SettingsPage(parent, this.settings);
      page.make();
    });

    tabs.onSelected = () => {
      this.settings.set('tab', tabs.index);
    };
  }
}
