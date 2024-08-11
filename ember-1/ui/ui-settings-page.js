import UiPersistText from "./ui-persist-text.js";
import Dixie from "../dixie/dixie.js";

export default class UiSettingsPage {
  constructor(parent, persist) {
    this.persist = persist;

    let div = Dixie.element('div', parent);

    new UiPersistText(div, this.persist, 'API key', 'apikey');
  }
}
