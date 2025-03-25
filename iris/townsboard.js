export default class TownsBoard {
  constructor() {
    this._clear();
  }

  _clear() {
    this.tiles = new Array(16).fill(null).map(() => ({}));
  }

  countUsed() {
    return this.tiles.filter(tile => tile.building || tile.resource).length;
  }
}