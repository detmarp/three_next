import Dixie from './dixie/dixie.js';
import DixieTabs from './dixie/dixie-tabs.js';
import UiMainPage from './ui/ui-main-page.js';
import UiEmberPage from './ui/ui-ember-page.js';
import UiAiPage from './ui/ui-ai-page.js';
import UiSettingsPage from './ui/ui-settings-page.js';
import BeePersist from './bee/bee-persist.js';

export default class Program {
  constructor() {
    this.persist = new BeePersist('ember-1');

    const outer = Dixie.makeOuter();

    Dixie.element('h2', outer, 'Ember 1');

    this.makeTabs(outer);
  }

  makeTabs(outer) {
    let tabs = new DixieTabs(outer);

    let mainTab = tabs.addTab('Main');
    new UiMainPage(mainTab);

    let emberTab = tabs.addTab('Ember');
    new UiEmberPage(emberTab);

    let aiTab = tabs.addTab('AI');
    new UiAiPage(aiTab);

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
