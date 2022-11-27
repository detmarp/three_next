import * as three from '../threejs/build/three.module.js';
import {Maker2} from './maker2.js';

export class Schem2 {
  constructor(myscene, hexer2) {
    this.hexer2 = hexer2;
    this.myscene = myscene;
    this.maker2 = new Maker2(myscene);
  }

  make() {
    let group = new three.Group();
    group.add(this.maker2.make([0, 0]));
    group.add(this.maker2.make([1, 0]));
    group.add(this.maker2.make([2, 0]));
    return group;
  }
}