import Tabber from './tabber.js';
import Persist from './persist.js';
import Settings from './settings.js';
import ChatPage from './chatpage.js';
import MemoryPage from './memorypage.js';
import TransactionPage from './transactionpage.js';
import MainPage from './mainpage.js';
import SettingsPage from './settingspage.js';

export default class Program {
  constructor() {
    this.persist = new Persist('ember_0');
    const defaults = {
      'apikey': '',
      'tab': 0,
    }
    this.settings = new Settings(this.persist, defaults);
  }

  run() {
    const header = document.createElement('h2');
    header.textContent = 'Ember 0';
    document.body.appendChild(header);

    const tabContainer = document.body;
    const tabs = new Tabber(tabContainer);

    tabs.addTab("Main", (parent) => {
      let page = new MainPage(parent, this);
      page.make();
    });

    tabs.addTab("Chat", (parent) => {
      let page = new ChatPage(parent, this);
      page.make();
    });

    tabs.addTab("Memory", (parent) => {
      let page = new MemoryPage(parent, this);
      page.make();
    });

    tabs.addTab("Transaction", (parent) => {
      let page = new TransactionPage(parent, this);
      page.make();
    });

    tabs.addTab("Settings", (parent) => {
      let page = new SettingsPage(parent, this.settings);
      page.make();
    });

    tabs.selectTab(this.settings.get('tab'));
    tabs.onSelected = () => {
      this.settings.set('tab', tabs.index);
    };
  }
}
