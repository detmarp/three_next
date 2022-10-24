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

    this.group = new three.Group();
    this.myscene.root.add(this.group);

    this.hexer.schematic.corners.forEach(c => {
      this.addDot(c, 1, [0x996600, 0xffdd00]);
    });

    this.hexer.schematic.allFaces.forEach(c => {
      this.addDot(c, 1, [0x004488, 0x0077ff]);
    });
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

    group.position.set(position[0]*size, position[1]*size);

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
}
