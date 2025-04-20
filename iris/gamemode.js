import Towns from './towns.js';
import DrawCard from './drawcard.js';
import Critters from './critters.js';
import Placement from './placements.js';

export default class GameMode {
  constructor(iris, towns) {
    this.iris = iris;
    this.towns = towns;

    this.colors = {
      background: '#ccdd99',
      scoreBackground: '#edc',
    };

    this._setup();
  }

  _setup() {

    this.layout = {
      tilearea: {
        bounds: [5, 140, 108 * 4, 81 * 4],
      },
      tiles: [],
      cards: [],
      resources: [],
      game: {
        bounds: [5, 48, 218, 144],
      },
      score: {
        bounds: [270, 10, 220, 144],
      },
    };

    // layout for 16 town tiles
    {
      const w = 108;
      const h = 81;
      const left = 9;
      const top = 140;
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
      const w = 78;
      const h = 68;
      const left = 8;
      const top = 480;
      let i = 0;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 2; col++) {
          let id = row * 2 + col;
          let stagger = (col % 2 === 0) ? 15 : 0;
          if (id == 7) {
            stagger += 25;
          }
          const x = left + col * w;
          const y = top + row * h + stagger;
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
      const h = 54;
      const left = 370;
      const top = 490;
      const stagger = 7;
      let i = 0;
      const names = ['wheat', 'stone', 'brick', 'wood', 'glass'];
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 1; col++) {
            const x = left + (row % 2 === 0 ? -stagger : stagger);
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
      //card.text = this.iris.addText(`${card.id}`, card.bounds);
      let onCLick = () => {
        this._setCard(card.id);
      };
      let area = this.iris.areas.addBounds(card.bounds, onCLick, this._onDragCards.bind(this));
      area.piece = this.towns.hand[card.id].card.category;
      area.type = 'card';
    });

    // card area
    this.drawCard = new DrawCard(this.iris);
    this.drawCard.getBounds([175, 480]),

    this.drawCard.setupText();
    let onClick = () => {
      this.drawCard.rotate();
    }
    this.iris.areas.addBounds(this.drawCard.bounds, onClick, this._onDragCard.bind(this));

    // resources
    this.layout.resources.forEach(resource => {
      //resource.text = this.iris.addText(`${resource.id}`, resource.bounds);
      let onClick = () => {
        //this._setCard(resource.id);
      };
      let area = this.iris.areas.addBounds(resource.bounds, onClick, this._onDragResource.bind(this));
      area.piece = resource.piece;
      area.type = resource.type;
    });

    // other areas
    this.iris.addText('game<br>no-rules mode', this.layout.game.bounds);

    const scoreTextBounds = [225 - 200, 5, 400, 60];
    this.scoreText = this.iris.addText('00', scoreTextBounds);
    this.scoreText.style.textAlign = 'center';
    this.scoreText.style.display = 'block';
    this.scoreText.style.margin = '0 auto';

    this.score2 = this.iris.addText('', this.layout.score.bounds);

    this._setCard(0);
    this.critters = new Critters(this.iris);
    this.placement = new Placement(this.iris, this.towns);

    this._showScore();

    this.iris.areas.addBounds([2, 2, 80, 50], () => {
      // FAKE exit wihtout ending
      this._saveGame(false);
      this.iris.program.goto('home')
    });

    this.iris.areas.addBounds([85, 2, 100, 40], () => {
      // FAKE END GAME
      this._saveGame(true);
      this.iris.program.goto('home')
    });

  }

  _setCard(i) {
    this.selectedCard = this.towns.hand[i].card;
    this.drawCard.setCard(this.selectedCard);
  }

  _center(bounds, offset = [0,0]) {
    return [
      bounds[0] + bounds[2] / 2 + offset[0],
      bounds[1] + bounds[3] / 2 + offset[1]
    ];
  }

  render(time, dt) {
    // logo, also exit button
    this.iris.helly.draw('logo', [2, 2]);

    const centerX = this.layout.tilearea.bounds[0] + this.layout.tilearea.bounds[2] / 2;
    const centerY = 20;
    const radius = 40;
    this.iris.context.beginPath();
    this.iris.context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    this.iris.context.fillStyle = this.colors.scoreBackground;
    this.iris.context.fill();

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
      let meeple = this._getMeeple(card.category);
      let start = this.iris.areas.start;
      if (start && start.type === 'card' && start.piece === card.category) {
        // dont draw when dragging start area is this one
        return;
      }
      //this.iris.helly.draw(`b_${card.category}`, this._center(c.bounds));
      this.iris.helly.draw(meeple.sprite, this._center(c.bounds, [0, 25]));
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

    this.placement.draw(time, dt);

    // cursor
    if (this.iris.areas.start && this.dragMeeple) {
      this.iris.helly.draw(this.dragMeeple.sprite, this.iris.areas.position);
    }
  }

  _buildingToSprite(building) {
    const map = { 'red': 'building00', 'blue': 'building01',
      'yellow': 'building02', 'green': 'building03', 'black': 'building04',
      'gray': 'building05', 'orange': 'building06', 'pink': 'building07'
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
      green: 'building03',
      black: 'building04',
      gray: 'building05',
      orange: 'building06',
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
    if (action === 'start') {
      this.dragMeeple = this._getMeeple(this.selectedCard.name);
      return true;
    }
    this._anyAction(action, area);
  }

  _onDragCards(action, area) {
    if (action === 'start') {
      this.dragMeeple = this._getMeeple(area.piece);
      return true;
    }
    this._anyAction(action, area);
  }

  _onDragResource(action, area) {
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
      this._showScore();
      return meeple;
    }
    let building = this.towns.board.tiles[tile].building;
    if (building) {
      this.towns.board.tiles[tile].building = null;
      let meeple = this._getMeeple(building);
      this._showScore();
      return meeple;
    }

    this._showScore();
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

    this._showScore();
  }

  _showScore() {
    let s = this.towns.getScore();
    this.score = s.total;

    let score1 = `${s.total}`;
    this.scoreText.innerHTML = score1;

    let score2 =
      `red:${s.red} ` +
      `blue:${s.blue}<br>` +
      `yellow:${s.yellow} ` +
      `orange:${s.orange}<br>` +
      `black:${s.black} ` +
      `gray:${s.gray}<br>` +
      `green:${s.green} ` +
      `pink:${s.pink}<br>` +
      `unused:${s.unused}<br>`;
    this.score2.innerHTML = score2;

    this.placement.find();

    this._saveGame(false);
  }

  _saveGame(over) {
    let save = this._getSaveObject();
    if (over) {
      save.over = true;
    }
    this.iris.saveGame(save);
  }

  _getSaveObject() {
    let save = this.towns.getSave();
    return save;
  }
}
