import * as three from '../threejs/build/three.module.js';
import {OrbitControls} from '../threejs/examples/jsm/controls/orbitcontrols.js';

export class Cameraman {
  // Some camera stuff.

  constructor(myscene) {
    this.myscene = myscene;
  }

  init() {
    this.camera = new three.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

    this.reset();

    this.controls = new OrbitControls(this.camera, this.myscene.renderer.domElement);
    this.controls.update();
  }

  reset() {
    this.camera.position.set(10, 150, 25);
    this.camera.up.set(0, 1, 0);
    this.camera.lookAt(0, 12, 0);
  }

  resize() {
    const canvas = this.myscene.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.controls.update();
  }

  work() {
  }
}
