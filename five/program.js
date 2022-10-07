import {MyScene} from './myscene.js';
import {Factory} from './factory.js';
import {heightMap} from './heightmap.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
    this.factory = new Factory(this.myscene);
  }

  run() {
    this.myscene.init();

    function h(x, y) {
      let i = x * 8;
      let j = y * 8;
      let k = j * 512 + i;
      return heightMap[k];

    }

    for  (let y = 0; y < 16; y++) {
      for  (let x = 0; x < 32; x++) {
        let i = Math.floor(x / 4);
        let j = Math.floor(y / 4);
        let tile = {
          form: 'tile',
          coord: [x-16,y-8],
          verts: this.getVerts(x, y),
        };
        this.factory.make(tile);
      }
    }

    this.myscene.run();
  }

  getVerts(x, y) {
    let v = [];
    for (let i = 0; i < 256; i++) {
      let x1 = Math.random();
      let y1 = Math.random();
      let x2 = (x + x1) / 32;
      let y2 = (y + y1) / 16;
      let t = (y + Math.random()) / 16;
      let h = this.getHeight(x2, y2);
      let x3 = x1 * 10;
      let y3 = y1 * 10;
      let c = 0;
      if (h > 0) {
        c = 1;
      }
      if (h > 150) {
        c = 4;
      }
      if (h > 200) {
        c = 5;
      }
      v.push([x3, h, y3, c]);
    }
    return v;
  }

  getHeight(s, t) {
    let i = Math.min(Math.floor(s * 512), 511);
    let j = Math.min(Math.floor(t * 256), 256);
    let k = j * 512 + i;
    return heightMap[k];
}
}
