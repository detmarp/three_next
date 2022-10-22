import * as three from '../threejs/build/three.module.js';
import {MyScene} from './myscene.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
  }

  run() {
    this.myscene.init();

    var floor = new three.Mesh(
      new three.PlaneGeometry(6, 6),
      new three.MeshPhongMaterial({ color: 0x114400 }));
    floor.position.set(0, 0, 0);
    floor.rotation.x = Math.PI * -0.5;
    this.myscene.root.add(floor);

    this.myscene.run();
  }
}
