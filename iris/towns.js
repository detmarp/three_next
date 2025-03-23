import TownsBoard from './townsboard.js';
import { makeDeck } from './townsdata.js';

export default class Towns {
  constructor() {
    this.board = new TownsBoard();
    this.deck = makeDeck();
  }
}