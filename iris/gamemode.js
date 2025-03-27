import Towns from './towns.js';
import DrawCard from './drawcard.js';
import Critters from './critters.js';

export default class GameMode {
  constructor(iris) {
    this.iris = iris;
    this.colors = {
      background: '#ccdd99'
    };

    this._setup();
  }

  _setup() {
    this.towns = new Towns();

    this.layout = {
      tilearea: {
        bounds: [9 - 4, 200 - 3, 108 * 4, 81 * 4],
      },
      tiles: [],
      cards: [],
      resources: [],
      game: {
        bounds: [5, 48, 218, 144],
      },
      score: {
        bounds: [226, 48, 220, 144],
      },
    };

    // layout for 16 town tiles
    {
      const w = 108;
      const h = 81;
      const left = 9;
      const top = 200;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          const x = left + col * w;
          const y = top + row * h;
          this.layout.tiles.push(
            {
              type: 'tile',
              bounds: [x, y, w, h],
              id: row * 4 + col,
             }
          );
        }
      }
    }

    // layout for cards
    {
      const w = 66;
      const h = 60;
      const left = 9;
      const top = 532;
      let i = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
          const x = left + col * w;
          const y = top + row * h;
          let card = {
            bounds: [x, y, w, h],
            id: i
          };
          this.layout.cards.push(card);
          i++;
        }
      }
    }

    // layout for resources
    {
      const w = 66;
      const h = 48;
      const left = 350;
      const top = 532;
      let i = 0;
      const names = ['wheat', 'stone', 'brick', 'wood', 'glass'];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 1; col++) {
            const x = left + (row % 2 === 0 ? -1/3 * w : 1/3 * w);
          const y = top + row * h;
          let resource = {
            bounds: [x, y, w, h],
            id: i,
            piece: names[i],
            type: 'resource',
          };
          this.layout.resources.push(resource);
          i++;
        }
      }
    }

    // areas for 16 tiles
    this.layout.tiles.forEach(tile => {
      let area = this.iris.areas.addBounds(tile.bounds, null, this._onDragBoard.bind(this));
      area.type = tile.type;
      area.id = tile.id;
    });

    // cards
    this.layout.cards.forEach(card => {
      card.text = this.iris.addText(`${card.id}`, card.bounds);
      let onCLick = () => {
        this._setCard(card.id);
      };
      let area = this.iris.areas.addBounds(card.bounds, onCLick, this._onDragCards.bind(this));
      area.piece = this.towns.hand[card.id].card.category;
      area.type = 'card';
    });

    // card area
    this.drawCard = new DrawCard(this.iris);
    this.drawCard.getBounds([153, 532]),

    this.drawCard.setupText();
    let onClick = () => {
      this.drawCard.rotate();
    }
    this.iris.areas.addBounds(this.drawCard.bounds, onClick, this._onDragCard.bind(this));

    // resources
    this.layout.resources.forEach(resource => {
      resource.text = this.iris.addText(`${resource.id}`, resource.bounds);
      let onClick = () => {
        //this._setCard(resource.id);
      };
      let area = this.iris.areas.addBounds(resource.bounds, onClick, this._onDragResource.bind(this));
      area.piece = resource.piece;
      area.type = resource.type;
    });

    // other areas
    this.iris.addText('game<br>no-rules mode', this.layout.game.bounds);
    this.iris.addText('score', this.layout.score.bounds);

    this._setCard(0);
    this.critters = new Critters(this.iris);
  }

  _setCard(i) {
    this.selectedCard = this.towns.hand[i].card;
    this.drawCard.setCard(this.selectedCard);
  }

  _center(bounds) {
    return [
      bounds[0] + bounds[2] / 2,
      bounds[1] + bounds[3] / 2,
    ];
  }

  render(time, dt) {
    // Reset drawing settings
    const ctx = this.iris.context;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#000';
    ctx.fillStyle = '#000';
    ctx.setLineDash([]);
    ctx.globalAlpha = 1.0;
    ctx.font = '10px sans-serif';

    this.drawCard.draw(this.towns.deck.theater);

    this.iris.helly.draw('board', this.layout.tilearea.bounds);

    this.layout.resources.forEach(resource => {
      const resourceId = `resource${String(resource.id).padStart(2, '0')}`;
      let start = this.iris.areas.start;
      if (!start || start.type !== 'resource' || start.piece !== resource.piece) {
        let center = this._center(resource.bounds);
        center[1] += 10;
        this.iris.helly.draw(resourceId, center);
      }
    });

    this.layout.cards.forEach(c => {
      let card = this.towns.hand[c.id].card;
      this.iris.helly.draw(`b_${card.category}`, this._center(c.bounds));
    });

    // Get all the board objects, sort them, then draw them
    let things = [];
    for (let i = 0; i < 16; i++) {
      let board = this.towns.board.tiles[i];
      let square = this.layout.tiles[i];
      if (board.building) {
        const b = this._buildingToSprite(board.building);
        things.push([b, { position: this._center(square.bounds)}]);
      }
      if (board.resource) {
        const r = this._resourceToSprite(board.resource);
        things.push([r, { position:   this._center(square.bounds)}]);
      }
    }
    let critters = this.critters.getSprites(time, dt);
    critters.forEach(critter => {
      things.push(critter);
    });
    things.sort((a, b) => a[1].position[1] - b[1].position[1]);
    things.forEach(([sprite, meta]) => {
      this.iris.helly.draw(sprite, null, meta);
    });

    // cursor
    if (this.iris.areas.start && this.dragMeeple) {
      this.iris.helly.draw(this.dragMeeple.sprite, this.iris.areas.position);
    }
  }

  _buildingToSprite(building) {
    const map = { 'red': 'building00', 'blue': 'building01',
      'yellow': 'building02', 'orange': 'building03', 'black': 'building04',
      'gray': 'building05', 'green': 'building06', 'pink': 'building07'
     };
    if (building in map) {
      return map[building];
    }
    return 'error';
  }

  _resourceToSprite(resource) {
    const map = { 'wheat': 'resource00', 'stone': 'resource01',
      'brick': 'resource02', 'wood': 'resource03', 'glass': 'resource04'
     };
    if (resource in map) {
      return map[resource];
    }
    return 'error';
  }

  _getMeeple(name) {
    const resources = {
      wheat: 'resource00',
      stone: 'resource01',
      brick: 'resource02',
      wood: 'resource03',
      glass: 'resource04',
    };
    const buildings = {
      red: 'building00',
      blue: 'building01',
      yellow: 'building02',
      orange: 'building03',
      black: 'building04',
      gray: 'building05',
      green: 'building06',
      pink: 'building07',
    };

    if (name in resources) {
      return {
        name: name,
        type: 'resource',
        sprite: resources[name],
      };
    }
    if (name in buildings) {
      return {
        name: name,
        type: 'building',
        sprite: buildings[name],
      };
    }
    return {
      name: 'none',
      type: 'none',
      sprite: 'error',
    };
  }

  _onDragBoard(action, area) {
    console.log(`Drag board ${action} ${JSON.stringify(area)}`);
    if (action === 'start') {
      let meeple = this._pickMeeple(area.id);
      if (meeple) {
        this.dragMeeple = meeple;
        return true;
      }
    }
    this._anyAction(action, area);
  }

  _onDragCard(action, area) {
    console.log(`Drag card ${action} ${JSON.stringify(area)}`);
    if (action === 'start') {
      this.dragMeeple = this._getMeeple(this.selectedCard.name);
      return true;
    }
    this._anyAction(action, area);
  }

  _onDragCards(action, area) {
    console.log(`Drag cards ${action} ${JSON.stringify(area)}`);
    if (action === 'start') {
      this.dragMeeple = this._getMeeple(area.piece);
      return true;
    }
    this._anyAction(action, area);
  }

  _onDragResource(action, area) {
    console.log(`Drag board ${action} ${JSON.stringify(area)}`);
    if (action === 'start') {
      this.dragMeeple = this._getMeeple(area.piece);
      return true;
    }
    this._anyAction(action, area);
  }

  _anyAction(action, area) {
    if (action === 'drop') {
      if (area && area.type === 'tile' && this.dragMeeple) {
        this._placeMeeple(this.dragMeeple, area.id);
      }
    }
    if (action === 'end') {
      this._endAction();
    }
  }

  _endAction() {
    this.dragMeeple = null;
  }

  _pickMeeple(tile) {
    let resource = this.towns.board.tiles[tile].resource;
    if (resource) {
      this.towns.board.tiles[tile].resource = null;
      let meeple = this._getMeeple(resource);
      return meeple;
    }
    let building = this.towns.board.tiles[tile].building;
    if (building) {
      this.towns.board.tiles[tile].building = null;
      let meeple = this._getMeeple(building);
      return meeple;
    }
  }

  _placeMeeple(meeple, tile) {
    let oldTile = this.towns.board.tiles[tile];
    if (oldTile.building || oldTile.resource) {
      return;
    }
    if (meeple.type === 'building') {
      this.towns.board.tiles[tile].building = meeple.name;
    }
    if (meeple.type === 'resource') {
      this.towns.board.tiles[tile].resource = meeple.name;
    }
  }
}
