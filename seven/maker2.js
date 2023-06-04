import * as three from '../threejs/build/three.module.js';

export class Maker2 {
  // Make the graphics elements for drawing the 2d scematic.  Discs and stuff.

  constructor(myscene, scale = 1) {
    this.myscene = myscene;

    this.size = 1;
    let radius = this.size / 2;

    this.discGeo = new three.CircleGeometry(radius, 32);
    this.myscene.res3.add(this.discGeo);
    this.lineGeo = new three.EdgesGeometry(this.discGeo);
    this.myscene.res3.add(this.lineGeo);
    this.discMat = [];
    this._addPhongMat(this.discMat, 0xff0000);
    this._addPhongMat(this.discMat, 0x0000ff);
    this.lineMat = [];
    this._addLineMat(this.lineMat, 0x00ff00);
    this._addLineMat(this.lineMat, 0xff8800);
  }

  make(position, color = 0) {
    let group = new three.Group();

    let disc = new three.Mesh(this.discGeo, this.discMat[color]);
    let line = new three.LineSegments(this.lineGeo, this.lineMat[color]);

    this.myscene.res3.add(disc);
    this.myscene.res3.add(line);

    group.add(disc);
    group.add(line);

    group.position.set(position[0] * this.size, position[1] * this.size, 0);

    return group;
  }

  _addPhongMat(list, color) {
    let mat = new three.MeshPhongMaterial({
      color: color,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    this.myscene.res3.add(mat);
    list.push(mat);
    return mat;
  }

  _addLineMat(list, color) {
    let mat = new three.LineBasicMaterial({
      color: color,
    });
    this.myscene.res3.add(mat);
    list.push(mat);
    return mat;
  }
}
