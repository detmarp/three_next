export default class TownsBoard {
  constructor() {
    this._clear();
  }

  _clear() {
    this.tiles = new Array(16).fill({});
  }
}