import Brains from './brains.js';
import ChatPage from './chatpage.js';
import Dixie from './dixie.js';
import MainPage from './mainpage.js';
import MemoryPage from './memorypage.js';
import Persist from './persist.js';
import Settings from './settings.js';
import SettingsPage from './settingspage.js';
import Tabber from './tabber.js';
import TransactionPage from './transactionpage.js';
import Ui from './ui.js';

export default class Program {
  constructor() {
    this.persist = new Persist('ember_0');
    this.defaults = {
      'apikey': '',
      'tab': 0,
      'persona': {
        'name': 'Detmar',
        'description': 'A guy'
      },
      'bot': {
        'name': 'Ember',
        'description':
          'I am a friendly and informative chatbot ' +
          'with a passion for learning. ' +
          'I can answer your questions ' +
          'in a helpful and engaging way, ' +
          'tailoring my responses to your ' +
          'specific needs. Still under ' +
          'development, I am constantly ' +
          'learning and improving my ' +
          'abilities. You can customize ' +
          'my settings to adjust my ' +
          'formality and humor level. I ' +
          'strive to be a reliable and ' +
          'trustworthy companion in ' +
          'your digital adventures.'
      }
    };
    this.settings = new Settings(this.persist, this.defaults);
  }

  run() {
    this.brains = new Brains(this);

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

    // temp hack to save
    // this.settings.set('bot', this.defaults['bot']);

        // remove all children of body
//        while (document.body.firstChild) {
//          document.body.removeChild(document.body.firstChild);
//        }
        this.ui = new Ui(this, document.body);

  }
}
