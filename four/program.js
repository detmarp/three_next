import {MyScene} from './myscene.js';
import {Factory} from './factory.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
    this.factory = new Factory(this.myscene);
  }

  run() {
    this.myscene.init();

    //this.factory.make();

    // [/] make a tile
    // [/] 2 tiles side by side
    // [ ] camera point, that camera automaticllay starts at?
    // [ ] make lights?
    // [ ]

    let tiles = [
      { coord:[-2, -2], material: 0},
      { coord:[-1, -2], verts:[[10,10,10]], material: 1 },
      { coord:[0, -2], verts:[[0,10,10]], material: 1 },
      { coord:[1, -2], },
      { coord:[-2, -1], },
      { coord:[-1, -1], verts:[[10,10,0]]},
      { coord:[0, -1], verts:[[0,10,0]]},
      { coord:[1, -1], material: 2 },
      { coord:[-2, 0], material: 3  },
      { coord:[-1, 0], verts:[[10,40,10]]},
      { coord:[0, 0], verts:[[0,40,10]]},
      { coord:[1, 0], },
      { coord:[-2, 1], },
      { coord:[-1, 1], verts:[[10,40,0]], material: 4 },
      { coord:[0, 1], verts:[[0,40,0]], material: 5 },
      { coord:[1, 1], },
    ];
    tiles.forEach(t => {
      t.form = 'tile';
      this.factory.make(t);
    });

    this.myscene.run();
  }
}
