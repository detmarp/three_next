import TownsRand from './townsrand.js';

export default class TownsPile {
  constructor(rand = new TownsRand()) {
    this.rand = rand;
    this._deal();
  }

  _deal() {
    let deck = [
      'wheat', 'wheat', 'wheat',
      'stone', 'stone', 'stone',
      'brick', 'brick', 'brick',
      'glass', 'glass', 'glass',
      'wood', 'wood', 'wood',
    ];
    this.rand.shuffle(deck);
    this.pool = deck.splice(0, 3);
    this.deck = deck;
  }

  choose(i) {
    const choice = this.pool.splice(i, 1)[0];
    this.pool[0] = this.deck.shift();
    this.deck.push(choice);
    return choice
  }

  toObject() {
    return {
      pool: this.pool,
      deck: this.deck,
    };
  }

  static fromObject(obj) {
    let pile = new TownsPile(new TownsRand());
    pile.pool = obj.pool;
    pile.deck = obj.deck;
    return pile;
  }
}