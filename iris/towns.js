import TownsBoard from './townsboard.js';
import TownsRand from './townsrand.js';
import TownsPile from './townspile.js';
import { makeDeck } from './townsdata.js';

export default class Towns {

  static create(saved) {
    // Static creator, from saved game data
    const towns = new Towns();
    if (saved) {
      towns.board.load(saved.board);
      towns.deck = saved.deck;
      towns.hand = saved.hand;
      towns.score = saved.score;
      towns.uuid = saved.uuid;
      towns.seed = saved.seed;
      towns.rand = TownsRand.fromObject(saved.rand);
      towns.pile = TownsPile.fromObject(saved.pile);
    }
    return towns;
  }

  constructor() {
    this.uuid = crypto.randomUUID();
    let seed = Math.floor(Math.random() * 1000000) + 100000;
    this.rand = new TownsRand(seed);

    this.pile = new TownsPile(this.rand);
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

    this.getScore();
  }

  _makeHand(labels) {
    return labels.map(label => ({
      label: label,
      card: this.deck[label]
    }));
  }

  getScore() {
    let total = 0;
    this.score = {
    }

    for (let item of this.hand) {
      let card = item.card;
      let category = card.category;
      let points = this._getCategoryPoints(category);
      this.score[category] = points;
      total += points;
    }

    let unused = 0;
    if (this.board.countUsed() == 16) {
      unused = -this.board.count(tile => !tile.building);
    }

    this.score.unused = unused;
    total += unused;

    this.score.total = total;

    return this.score;
  }

  _getCategoryPoints(category) {
    let points = 0;

    if (category == 'red') {
      // farm
      // no points
    }

    if (category == 'blue') {
      // cottage
      if (this.board.count(tile => tile.building == 'red')) {
        let count = this.board.count(tile => tile.building == 'blue');
        points = Math.min(count, 4) * 3
      }
    }

    if (category == 'pink') {
      // guild
      let count = this.board.count(tile => tile.building == 'pink');
      points = Math.min(count, 1);
    }

    if (category == 'orange') {
      // chapel
      let fed = this._getCategoryPoints('blue') / 3;
      let count = this.board.count(tile => tile.building == 'orange');
      return count *  fed
    }

    if (category == 'green') {
      // tavern
      let count = this.board.count(tile => tile.building == 'green');
      points = [0, 2, 5, 9, 14, 20][Math.min(count, 5)];
    }

    if (category == 'black') {
      // factory
      points = 0;
    }

    if (category == 'yellow') {
      // theater
      for (let i = 0; i < 16; i++) {
        let tile = this.board.tiles[i];
        if (tile.building == 'yellow') {
          let set = new Set();
          for (let x = 0; x < 4; x++) {
            if (x == tile.x) continue;
            let t = this.board.tiles[x + tile.y * 4];
            if (t.building) {
              set.add(t.building);
            }
          }
          for (let y = 0; y < 4; y++) {
            if (y == tile.y) continue;
            let t = this.board.tiles[tile.x + y * 4];
            if (t.building) {
              set.add(t.building);
            }
          }
          points += set.size;
        }
      }
    }

    if (category == 'gray') {
      // well
      for (let i = 0; i < 16; i++) {
        let tile = this.board.tiles[i];
        if (tile.building == 'gray') {
          if (tile.x > 0 && this.board.tiles[i - 1].building == 'blue') {
            points += 1;
          }
          if (tile.x < 3 && this.board.tiles[i + 1].building == 'blue') {
            points += 1;
          }
          if (tile.y > 0 && this.board.tiles[i - 4].building == 'blue') {
            points += 1;
          }
          if (tile.y < 3 && this.board.tiles[i + 4].building == 'blue') {
            points += 1;
          }
        }
      }
    }
    return points;
  }

  getSave() {
    let hand = this.hand.reduce((map, item) => {
      const category = this.deck[item.label].category;
      if (!map[category]) {
        map[category] = item.label;
      }
      return map;
      }, {});

    let board = this.board.tiles.map(tile => {
      let items = [];
      if (tile.building) items.push(tile.building);
      if (tile.resource) items.push(tile.resource);
      return items;
    });

    let save = {
      timestamp: Date.now(),
      score: this.score.total,
      version: 1,
      uuid: this.uuid,
      hand: hand,
      board: board,
      rand: this.rand.toObject(),
      pile: this.pile.toObject(),
    };
    return save;
  }
}