import Towns from './towns.js';

export default class GameMode {
  constructor(iris) {
    this.iris = iris;
    this._setup();
  }

  _setup() {
    this.layout = {
      card: {
        bounds: [153, 532, 144, 240],
        label: 'card',
      },
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
          this.layout.tiles.push({ bounds: [x, y, w, h] });
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
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 1; col++) {
            const x = left + (row % 2 === 0 ? -1/3 * w : 1/3 * w);
          const y = top + row * h;
          let resource = {
            bounds: [x, y, w, h],
            id: i
          };
          this.layout.resources.push(resource);
          i++;
        }
      }
    }

    // areas for 16 tiles
    this.layout.tiles.forEach(tile => {
      this.iris.areas.add(tile.bounds);
    });

    // cards
    this.layout.cards.forEach(card => {
      card.text = this.iris.addText(`${card.id}`, card.bounds);
      let onCLick = () => {
        this._setCard(card.id);
      };
      this.iris.areas.add(card.bounds, onCLick);
    });

    // card area
    this.layout.card.text = this.iris.addText(this.layout.card.label, this.layout.card.bounds);
    this.iris.areas.add(this.layout.card.bounds);

    // resources
    this.layout.resources.forEach(resource => {
      resource.text = this.iris.addText(`${resource.id}`, resource.bounds);
      let onClick = () => {
        //this._setCard(resource.id);
      };
      this.iris.areas.add(resource.bounds, onClick);
    });

    // other areas
    this.iris.addText('game<br>no-rules mode', this.layout.game.bounds);
    this.iris.addText('score', this.layout.score.bounds);

    this._setCard(0);

    this.towns = new Towns();
  }

  _setCard(i) {
    this.layout.card.text.textContent = `card ${i}`;
  }

  _center(bounds) {
    return [
      bounds[0] + bounds[2] / 2,
      bounds[1] + bounds[3] / 2,
    ];
  }

  render(dt) {
    this.iris.helly.draw('card00', this.layout.card.bounds);

    this.iris.helly.draw('board', this.layout.tilearea.bounds);

    for (let i = 0; i < 16; i++) {
      let board = this.towns.board.tiles[i];
      let square = this.layout.tiles[i];
      if (board.building) {
        const b = this._buildingToSprite(board.building);
        this.iris.helly.draw(b, this._center(square.bounds));
      }
      if (board.resource) {
        const r = this._resourceToSprite(board.resource);
        this.iris.helly.draw(r, this._center(square.bounds));
      }
    }

    this.layout.resources.forEach(resource => {
      const resourceId = `resource${String(resource.id).padStart(2, '0')}`;
      this.iris.helly.draw(resourceId, this._center(resource.bounds));
    });

    //this.iris.helly.draw('resource00', [350, 100]);
    //this.iris.helly.draw('resource01', [390, 150]);
    //this.iris.helly.draw('resource00', [350, 200]);

    // cursor
    if (this.iris.areas.start) {
      this.iris.helly.draw('building00', this.iris.areas.position);
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
}
