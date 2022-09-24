import * as three from '../threejs/build/three.module.js';
import {OrbitControls} from '../threejs/examples/jsm/controls/orbitcontrols.js';

export class Program {
  constructor() {
  }

  setup() {
    this.renderer = new three.WebGLRenderer();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( this.renderer.domElement );
  }

   start() {
    this.scene = new three.Scene();
    this.scene.background = new three.Color(0x2266cc);

    const ambient = new three.AmbientLight(0x667788);
    this.scene.add(ambient);

    const directional = new three.DirectionalLight(0xffffff, 1);
    directional.position.set ( 5, 20, 10);
    this.scene.add(directional);

    this.camera = new three.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    this.camera.position.set(0, 2, 4);

    this.g = {}

    this.g.controls = new OrbitControls( this.camera, this.renderer.domElement );

    this.g.o = [];
    this.addGeo(new three.BoxGeometry(), 0xeedd88, [0, 0.5, 0]);
    this.addGeo(new three.OctahedronGeometry(0.8), 0x880000, [0, .92, 0]).rotation.y = Math.PI / 4;

    this.tree(-3, -2);
    this.tree(-3, 0);
    this.tree(-3, 1);
    this.tree(-2, -1);
    this.tree(-2, 1);
    this.tree(-2, 2);
    this.tree(-1, -1);
    this.tree(-1, 1);
    this.tree(0, -2);
    this.tree(1, 1);
    this.tree(2, 1);
    this.tree(2, 2);
    this.tree(3, 2);

    var floor = new three.Mesh(
      new three.PlaneGeometry(6, 6),
      new three.MeshPhongMaterial({ color: 0x114400 }));
    floor.position.set(0, 0, 0);
    floor.rotation.x = Math.PI * -0.5;
    this.scene.add(floor);
  }

   tree(x, z) {
    this.addGeo(new three.CylinderGeometry(0.1, 0.1, 2), 0x665500, [x, 1, z]);
    this.addGeo(new three.SphereGeometry(0.4), 0x44ee00, [x, 2, z]);
  }

   addGeo(geometry, color, position) {
    var mesh = new three.Mesh(geometry,
      new three.MeshPhongMaterial({ color: color }));
    if (position) {
        mesh.position.set(position[0],position[1],position[2]);
    }
    else {
        var i = g.o.length;
        var x = (i % 3 - 1) * 2 ;
        var z = (Math.floor(i / 3) -1) * -2;
        mesh.position.set(x, 0, z);
        g.o.push(mesh);
    }
    this.scene.add(mesh);
    return mesh;
  }

   resize() {
    const canvas = this.renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    this.renderer.setSize(width, height, false);
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );

    this.g.controls.update();
  }

   work() {
  }

   draw() {
    this.renderer.render(this.scene, this.camera);
  }

   update() {
    this.resize();
    this.work();
    this.draw();
    requestAnimationFrame(() => {this.update();});
  }

   run() {
    this.setup();
    this.start();
    this.update();
  }

}
