export default class GameMode {
  constructor(iris) {
    this.iris = iris;
    this._setup();
  }

  _setup() {
    this.layout = {
      card: {
        bounds: [153, 48, 144, 240],
        label: 'card',
      },
      tilearea: {
      },
      tiles: [
        { bounds: [9, 455, 108, 81] },
        { bounds: [9 + 108, 455, 108, 81] }
      ]
    };

    this.layout.tiles.forEach(tile => {
      this.iris.areas.add(tile.bounds);
    });

    this.iris.addText(this.layout.card.label, this.layout.card.bounds);
    this.iris.areas.add(this.layout.card.bounds);
  }

  render(dt) {
    /*
    const radius = 100;
    const x = 0;
    const y = 0;

    const cellSize = 50;
    const cols = 8;
    const rows = 15;

    // for (let row = 0; row < rows; row++) {
    //   for (let col = 0; col < cols; col++) {
    //     const cellX = col * cellSize;
    //     const cellY = row * cellSize;

    //     this.context.strokeStyle = 'red';
    //     this.context.lineWidth = 1;
    //     this.context.strokeRect(cellX, cellY, cellSize, cellSize);
    //   }
    // }

    this.helly.draw('board', [5, 455]);
    this.helly.draw('building00', [5 + 440 * 1/8, 455 + 330 * 1/8]);
    this.helly.draw('building01', [5 + 440 * 3/8, 455 + 330 * 3/8]);
    this.helly.draw('resource00', [5 + 440 * 5/8, 455 + 330 * 3/8]);
    this.helly.draw('resource01', [5 + 440 * 3/8, 455 + 330 * 5/8]);
    this.helly.draw('resource01', [5 + 440 * 5/8, 455 + 330 * 5/8]);
    */
    this.iris.helly.draw('card00', this.layout.card.bounds);

    if (this.iris.areas.start) {
      this.iris.helly.draw('building00', this.iris.areas.position);
    }
  }
}
