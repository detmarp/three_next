import {MyScene} from './myscene.js';
import {Factory} from './factory.js';
import {heightMap} from './heightmap.js';
import {colorMap} from './colormap.js';

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
          //verts: this.getVerts5(x, y),
        };
        this.factory.make(tile);
      }
    }

    this.myscene.run();
  }

  getVert(tx, ty, fx, fy) {
    // make a vert, for tile [tx, ty], and fraction of that tile [fx, fy]
    let v = [fx * 10, 0, fy * 10 + Math.random() * 0.0, 3];
    return v;
  }

  getVerts5(x, y) {
    // retun 5 verts for this tile
    let size = 10;
    let vs = [];
    vs.push(this.getVert(x, y, 0.1, 0));
    vs.push(this.getVert(x, y, 0, 1));
    vs.push(this.getVert(x, y, 1, 0.1));
    vs.push(this.getVert(x, y, 1.1, 0.9));
    vs.push(this.getVert(x, y, 0.5, 0.5));

    return vs;
  }

  getVerts(x, y) {
    // x, y are the tile coords
    let v = [];
    let n = 12;
    for (let i = 0; i <=n; i++) {
      for (let j = 0; j <=n; j++) {
        // coords within the tile, 0-10 scale
        let x3 = i * 10 / n;
        let y3 = j * 10 / n;

        // noise
        if (i > 0 && i < (n-1) && j > 0 && j < (n-1)) {
          let d = 1;
          x3 += (Math.random() - 0.5) * d;
          y3 += (Math.random() - 0.5) * d;
        }

        // coords with the tile, on the unit scale
        let x1 = x3 / 10;
        let y1 = y3 / 10;
        // coords, mapped to the height map on that map's 0-1 scale
        let x2 = (x + x1) / 32;
        let y2 = (y + y1) / 16;

        let h = this.getHeight(x2, y2);
        let c = this.getColor(x2, y2);
        v.push([x3, h, y3, c]);
      }
    }
    return v;
  }

  getHeight(s, t) {
    let i = Math.min(Math.floor(s * 512), 511);
    let j = Math.min(Math.floor(t * 256), 255);
    let k = j * 512 + i;
    return heightMap[k];
  }

  getColor(s, t) {
    let i = Math.min(Math.floor(s * 512), 511);
    let j = Math.min(Math.floor(t * 256), 255);
    let k = j * 512 + i;
    let c = colorMap[k];
    if (c < 8) {
      return c;
    }
    return 7;
  }
}
