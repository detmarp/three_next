import * as three from '../threejs/build/three.module.js';
import {Res3} from './res3.js';
import {Cameraman} from './cameraman.js';

export class MyScene {
  // A rough approximation of a 3d engine.
  // Uses threejs.

  constructor(params = {init:true}) {
    this.inited = false;
    this.params = params;
    this._id = 0;
    this.workers = new Map();
    if (params.init) {
      this.init();
    }
  }

  init() {
    if (this.inited) {
      return;
    }

    this._initThree();
    this.res3 = new Res3();

    this.rootScene.background = new three.Color(0x0000ff);
    const ambient = new three.AmbientLight(0x667788);
    this.rootScene.add(ambient);

    const directional = new three.DirectionalLight(0xeeeeee, 1);
    directional.position.set ( 5, 20, 10);
    this.rootScene.add(directional);

    this.cameraman = new Cameraman(this);
    this.cameraman.init();
    this.inited = true;
  }

  _initThree() {
    this.renderer = new three.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    this.rootScene = new three.Scene();
  }

  resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    this.renderer.setSize(width, height, false);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.cameraman.resize();
  }

  update() {
    this.resize();
    this.workers.forEach((v) => {
      if (v.onUpdate) {
        v.onUpdate();
      }
    });
    this.renderer.render(this.rootScene, this.cameraman.camera);
    this.cameraman.work();
    // Callback next frame.
    requestAnimationFrame(() => { this.update(); });
  }

  run() {
    this.update();
  }

  addCallback(callback) {
    // Add a simple object with this callback as its onUpdate().
    return this.addWorker({
      onUpdate:callback
    });
  }

  addWorker(worker) {
    worker.mysceneid = this._id++;
    this.workers.set(worker.mysceneid, worker);
    return worker;
  }

  removeWorker(worker) {
    this.workers.delete(worker.mysceneid);
  }
}
