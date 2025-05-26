export default class Rules {
  constructor(data) {
    this.data = data || {};
  }

  editor(parent, callback) {
    this.editor = document.createElement('div');
    this.callback = callback || (() => {});
    parent.appendChild(this.editor);
    this._refreshEditor(callback);
    return this.editor;
  }

  _checkbox(label, key) {
    const container = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!this.data[key];
    checkbox.addEventListener('change', () => {
      this.data[key] = checkbox.checked;
      this.callback(this.data);
    });

    const labelElement = document.createElement('label');
    labelElement.textContent = label;

    container.appendChild(checkbox);
    container.appendChild(labelElement);
    this.editor.appendChild(container);
  }

  _refreshEditor() {
    if (this.editor) {
      this.editor.innerHTML = '';
      this._checkbox('Allow move after placing', 'allowmove');
      this._checkbox('Play with all resources', 'allresources');
      this._checkbox('Free play', 'freeplay');
    }
  }
}
