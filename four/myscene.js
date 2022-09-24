import * as three from '../threejs/build/three.module.js';
import {OrbitControls} from '../threejs/examples/jsm/controls/orbitcontrols.js';

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

    const directional = new three.DirectionalLight(0xffffff, 1);
    directional.position.set ( 5, 20, 10);
    this.root.add(directional);

    this.camera = new three.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 2, 4);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    let floor = new three.Mesh(
      new three.PlaneGeometry(6, 6),
      new three.MeshPhongMaterial({ color: 0x007700 }));
    floor.position.set(0, 0, 0);
    floor.rotation.x = Math.PI * -0.5;
    this.root.add(floor);
  }

   resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.controls.update();
  }

   update() {
    this.resize();
    this.renderer.render(this.root, this.camera);
    requestAnimationFrame(() => { this.update(); });
  }

   run() {
    this.update();
  }
}
