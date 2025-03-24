import TownsBoard from './townsboard.js';
import { makeDeck } from './townsdata.js';

export default class Towns {
  constructor() {
    this.board = new TownsBoard();
    this.deck = makeDeck();
    this.hand = this._makeHand([
      'cottage',
      'theater',
      'tavern',
      'chapel',
      'factory',
      'farm',
      'well',
      'guild'
    ]);
  }

  _makeHand(labels) {
    return labels.map(label => ({
      label: label,
      card: this.deck[label]
    }));
  }
}