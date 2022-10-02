import * as three from '../threejs/build/three.module.js';
import {Cameraman} from './cameraman.js';

export class MyScene {
  // A rough approximation of a 3d engine.
  // Uses threejs.

  constructor() {
  }

  init() {
    this.renderer = new three.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.root = new three.Scene();

    this.root.background = new three.Color(0x0000ff);
    const ambient = new three.AmbientLight(0x667788);
    this.root.add(ambient);

    const directional = new three.DirectionalLight(0xeeeeee, 1);
    directional.position.set ( 5, 20, 10);
    this.root.add(directional);

    this.cameraman = new Cameraman(this);
    this.cameraman.init();
  }

   resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setSize(width, height, false);
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.cameraman.resize();
  }

   update() {
    this.resize();
    this.renderer.render(this.root, this.cameraman.camera);
    this.cameraman.work();
    // Callback next frame.
    requestAnimationFrame(() => { this.update(); });
  }

   run() {
    this.update();
  }
}
