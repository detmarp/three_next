export default class TownsBoard {
  constructor() {
    this._clear();
  }

  _clear() {
    this.tiles = new Array(16).fill(null).map(() => ({}));
    this.tiles[0].resource = 'wheat';
    this.tiles[3].resource = 'glass';
    this.tiles[6].resource = 'stone';
    this.tiles[10].resource = 'wood';
    this.tiles[12].resource = 'brick';
    this.tiles[15].resource = 'wheat';

    this.tiles[2].building = 'red';
    this.tiles[3].building = 'green';
    this.tiles[6].building = 'blue';
    this.tiles[7].building = 'gray';
    this.tiles[8].building = 'pink';
    this.tiles[9].building = 'yellow';
    this.tiles[10].building = 'orange';
    this.tiles[13].building = 'black';
    this.tiles[14].building = 'gray';
  }
}