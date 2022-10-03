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
          coord:[x-16,y-8],
          verts:[
            [0,h(x*2, y*2),0],
            [10,h(x*2+2, y*2),0],
            [0,h(x*2, y*2+2),10],
            [10,h(x*2+2, y*2+2),10],
            [5,h(x*2+1, y*2+1),5],
          ],
          faces: [
            [0,4,1],
            [1,4,3],
            [4,2,3],
            [4,0,2],
          ],
          material:1,
        };
        this.factory.make(tile);
      }
    }

    this.myscene.run();
  }
}
