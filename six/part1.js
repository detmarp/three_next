import * as three from '../threejs/build/three.module.js';
import {Hexer} from './hexer.js';

export class Part1 {
  constructor(myscene, n) {
    this.myscene = myscene;
    this.n = n;
    this.create();
  }

  create() {
    this.hexer = new Hexer(this.n);
    console.log(JSON.stringify(this.hexer.stats));

    this.group = new three.Group();
    this.myscene.root.add(this.group);

    this.hexer.schematic.corners.forEach(c => {
      this.addDot(c, 1, [0x996600, 0xffdd00]);
    });

    this.hexer.schematic.allFaces.forEach(c => {
      this.addDot(c, 1, [0x004488, 0x0077ff]);
    });

    let sphere = this.makeSchematicSphere(this.hexer);
    this.group.add(sphere);
  }

  addDot(position, size, colors) {
    let group = new three.Group();

    const geometry = new three.CircleGeometry(size/2, 32);
    const material = new three.MeshPhongMaterial({
      color: colors[0],
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    const circle = new three.Mesh(geometry, material);
    this.myscene.res3.add(circle);
    group.add(circle);

    let wireGeo = new three.EdgesGeometry(circle.geometry);
    var mm = new three.LineBasicMaterial({
      color: colors[1],
    });
    var ee = new three.LineSegments( wireGeo, mm );
    this.myscene.res3.add(ee);
    group.add(ee);

    group.position.set(position[0]*size, position[1]*size, 0);

    this.group.add(group);
  }

  destroy() {
    this.myscene.res3.destroy(this.group);
    this.group = null;
  }

  reset(n) {
    this.destroy();
    this.n = n;
    this.create();
  }

  makeSchematicSphere(hexer) {
    let group = new three.Group();
    hexer.sphere.verts.forEach(v => {
      let position = new three.Vector3(v[0], v[1], v[2]);
      group.add(this.makeball(position));
    });

    return group;
  }

  makeball(position) {
    const geometry = new three.SphereGeometry(0.15);
    const material = new three.MeshPhongMaterial({color: 0x996600,});
    const circle = new three.Mesh(geometry, material);
    this.myscene.res3.add(circle);
    if (position) {
      circle.position.set(position.x, position.y, position.z);
    }
    return circle;
  }

}
