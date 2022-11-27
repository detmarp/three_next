import * as three from '../threejs/build/three.module.js';

export class Maker2 {
  // A class for making the graphics for a sphere.

  constructor(myscene, scale = 1) {
    this.myscene = myscene;

    this.size = 1;
    let radius = this.size / 2;

    this.discGeo = new three.CircleGeometry(radius, 32);
    this.lineGeo = new three.EdgesGeometry(this.discGeo);

    this.discMat = new three.MeshPhongMaterial({
      color: 0xff0000,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    this.lineMat = new three.LineBasicMaterial({
      color: 0x00ff00,
    });

    this.myscene.res3.add(this.discGeo);
    this.myscene.res3.add(this.lineGeo);
    this.myscene.res3.add(this.discMat);
    this.myscene.res3.add(this.lineMat);
  }

  make(position) {
    let group = new three.Group();

    let disc = new three.Mesh(this.discGeo, this.discMat);
    let line = new three.LineSegments(this.lineGeo, this.lineMat);

    this.myscene.res3.add(disc);
    this.myscene.res3.add(line);

    group.add(disc);
    group.add(line);

    group.position.set(position[0] * this.size, position[1] * this.size, 0);

    return group;
  }
}
