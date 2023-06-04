import * as three from '../threejs/build/three.module.js';
import {Hexer} from './hexer.js';
import { Hexer2 } from './hexer2.js';
import {Maker1} from './maker1.js';
import {Schem2} from './schem2.js';

export class Part1 {
  constructor(myscene, n) {
    this.myscene = myscene;
    this.n = n;
    this.create();
  }

  create() {
    this.hexer = new Hexer(this.n);
    this.maker = new Maker1(this.myscene, this.hexer.schematic.scale);

    this.group = new three.Group();
    this.myscene.rootScene.add(this.group);

    this.hexer.schematic.corners.forEach(c => {
      //this.addDot(c, 1, [0x996600, 0xffdd00]);
    });

    this.hexer.schematic.allFaces.forEach(c => {
      //this.addDot(c, 1, [0x004488, 0x0077ff]);
    });

    let sphere = this.make2(this.hexer);
    this.group.add(sphere);

    let hexer2 = new Hexer2(this.n);
    let schem = new Schem2(this.myscene, hexer2);  // Schem makes a 2d sketch of a hex schematic.
    this.group.add(schem.make());
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
    this.maker.destroy();
  }

  reset(n) {
    this.destroy();
    this.n = n;
    this.create();
  }

  make2(hexer) {
    let group = new three.Group();

    for (let i = 0; i < 12; i++) {
      let corner = hexer.corners[i];
      this._addPent(corner, group);
    }
    for (let i = 0; i < 10; i++) {
      let corner = hexer.corners[i];
      this._addFaces(corner, group);
    }
    return group;
  }

  _addPent(corner, group) {
    // Add the pentagon for this corner.
    this.maker.makeball(1, this._fromSpherA(corner.spherical), group);
  }

  _addFaces(corner, group) {
    // Add the two up and down faces for this corner.
    this._addFace(corner, true, group);
    this._addFace(corner, false, group);
  }

  _addFace(corner, up, group) {
    // Add one face for this corner.
    let patch = this.hexer.definePatch(corner.ci, up);
    let face = up ? this.hexer.schematic.ups : this.hexer.schematic.downs;
    // Build a list of fractional offsets, for each hex in face.
    let fracs = [];
    face.forEach(h => {
      let s = [h[0], up ? h[1] : -h[1]];
      fracs.push(this.hexer.toTri(s));
    });
    // Convert each frac offset to a final spherical coordinate, using patch.
    let sph = [];
    fracs.forEach(f => {
      sph.push(this._paramToPatch(f, patch));
    });
    // Draw each hex.
    sph.forEach(s => {
      this.maker.makeball(0, this._fromSpherA(s), group);
    });
  }

  _paramToPatch(f, patch) {
    // f is [x,y] param pair
    // patch has corner elements
    // returns a spherical coordinate
    let ac = this.hexer.lerpSph(patch.a.spherical, patch.c.spherical, f[1]);
    let bc = this.hexer.lerpSph(patch.b.spherical, patch.c.spherical, f[1]);
    let s = this.hexer.lerpSph(ac, bc, f[0]);
    return s;
  }

  _fromSpherA(array) {return this._fromSpher(array[0], array[1]); }

  _fromSpher(theta, phi) {
    return new three.Vector3(
        Math.cos(phi) * Math.cos(-theta),
        Math.sin(phi),
        Math.cos(phi) * Math.sin(-theta),
    );
  }
}
