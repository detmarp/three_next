import UiPersistText from "./ui-persist-text.js";
import Dixie from "../dixie/dixie.js";

export default class UiSettingsPage {
  constructor(parent) {
    this.element = document.createElement('div');
    if (parent) {
      parent.appendChild(this.element);
    }

    Dixie.makeTextWidget(this.element, 'text 1');

    new UiPersistText(this.element);

    Dixie.makeTextWidget(this.element, 'text 2');
  }
}
