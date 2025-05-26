import Placement from './placements.js';

export default class GameState {
  /* GameState tracks the logic of the current state of the game,
     mainly the moves that are available to the player at this moment.
  */
  constructor(towns) {
    this.towns = towns;
    this.modes = ['ready', 'placing', 'pending', 'special', 'gameover'];
    this.placement = new Placement(this.towns);
    this.startGame();
    this._print();
  }

  startGame() {
    this.resources = ['wheat', 'stone', 'brick', 'wood', 'glass'];
    this.holding = null;
    this.startMode('ready');
  }

  pickUp(item) {
    // Item can be a meeple name, or a resource index
    if (typeof item === 'number' && item >= 0 && item < this.resources.length) {
      let resource = this.resources[item];
      this.resources[item] = '';
      this.startMode('placing');
      this.holding = {
        type: 'resource',
        name: resource,
        index: item
      };
      return resource
    }
    return false;
  }

  startMode(mode) {
    this.mode = mode;
    this._update();
    this._print();
  }

  cancel() {
    // restore resource pool
    // restore picked resources on board for building placement
    // restore building list
    // forget held meeple
    // go back to ready mode
    switch (this.mode) {
      case 'placing':
        this.resources[this.holding.index] = this.holding.name;
        this.holding = null;
        this.startMode('ready');
        break;
    }
  }

  place(index) {
    // Place held item at index
    if (this.mode == 'placing' && this.holding) {
      if (index >= 0 && index < this.towns.board.tiles.length) {
        if (this.holding.type == 'resource') {
          this.towns.board.tiles[index].resource = this.holding.name;
          this.holding = null;
          this._nextResource();
          this.startMode('ready');
          return true;
        }
      }
    }
  }

  cyclePlacements() {
  }

  _nextResource() {
    this.resources = ['wheat', 'stone', 'brick', 'wood', 'glass'];
  }

  _update() {
    this.placement.find();
    this.towns.getScore();
  }

  _print() {
    // Debug print to console
    console.log('ggg');
    console.log(`  mode:${this.mode}`);
    console.log(`  resources:${this.resources.join(',')}`);
    console.log(`  placements:${this.placement.groups.length}`);
  }
}
