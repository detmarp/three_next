import Dixie from "../dixie/dixie.js";

export default class UiPersistText {
  constructor(parent, persist, label, key) {
    this.persist = persist;

    Dixie.element('div', parent, label);

    let area = Dixie.element('textarea', parent);
    area.style.width = '100%';
    area.style.resize = 'vertical';
    area.style.height = '2em';
    area.value = persist.get(key, '');
    area.addEventListener('input', () => {
      area.style.height = 'auto';
      area.style.height = area.scrollHeight + 'px';
      persist.set(key, area.value);
      console.log('Textarea content changed:', area.value);
    });

    Dixie.element('div', parent, 'edit box');
  }
}
