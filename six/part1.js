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

    let xx = [
      this.hexer.schematic.dx[0] * this.hexer.schematic.edge,
      this.hexer.schematic.dx[1] * this.hexer.schematic.edge,
    ];
    let yy = [
      this.hexer.schematic.dy[0] * this.hexer.schematic.edge,
      this.hexer.schematic.dy[1] * this.hexer.schematic.edge,
    ];
    this.addDot(xx, 1, [0x880000, 0xaa0000]);
    this.addDot(yy, 1, [0x880000, 0xaa0000]);

    let sphere = this.make2(this.hexer);
    //let sphere = this.makeSchematicSphere(this.hexer);
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

  make2(hexer) {
    let group = new three.Group();
    for (let i = 0; i < 12; i++) {
      let c = hexer.korners[i];
      group.add(
        this._setPosV(
          this._makeball(),
          this._fromSpher(c.spherical[0], c.spherical[1])
        )
      );
    }

    for (let j = 0; j < 10; j++) {
      let c = hexer.korners[j];
      group.add(this._makePatch(
        hexer,
        j, c.rightCi, c.upCi
      ));
      group.add(this._makePatch(
        hexer,
        j, c.rightCi, c.downCi
      ));
    }

    return group;
  }

  _makePatch(hexer, c0, c1, c2) {
    // c0 is the start corner index
    // c1 is the corner index to the right
    // c2 is the corner index up (or down)
    let group = new three.Group();

    let a = hexer.korners[c0].spherical;
    let b = hexer.korners[c2].spherical;
    let c = hexer.korners[c1].spherical;
    for (let f = 0.0; f < 0.8; f += 0.05) {
      let sph = hexer.lerpPatch(a, b, c, 0, f);
      group.add(
        this._setPosV(
          this._makeball(0.05, 0x00aa00),
          this._fromSpher(sph[0], sph[1])
        )
      );
      sph = hexer.lerpPatch(a, b, c, f, 0);
      group.add(
        this._setPosV(
          this._makeball(0.05, 0xff0000),
          this._fromSpher(sph[0], sph[1])
        )
      );
      sph = hexer.lerpPatch(a, b, c, f, .5);
      group.add(
        this._setPosV(
          this._makeball(0.05, 0x9900ff),
          this._fromSpher(sph[0], sph[1])
        )
      );
    }

    return group;
  }

  makeSchematicSphere(hexer) {
    let group = new three.Group();
    hexer.sphere.verts.forEach(v => {
      let position = new three.Vector3(v[0], v[1], v[2]);
      group.add(this.makeball(position));
    });



    // JUNK
    // add some other balls
    function _spher(i) {
      return hexer.sphere.spherical[i];
    }
    function _fromSpher(s) {
      return new three.Vector3(
          Math.cos(s[0]) * Math.cos(-s[1]),
          Math.sin(s[0]),
          Math.cos(s[0]) * Math.sin(-s[1]),
      );
    }

    let w0 = _fromSpher(_spher(0));
    let w2 = _fromSpher(_spher(2));
    let w4 = _fromSpher(_spher(4));

    let s0 = _spher(2);
    let s2 = _spher(1);
    let s4 = _spher(3);
    let dx = [s0[0]-s2[0], s0[1]-s2[1]];
    let dy = [s4[0]-s2[0], s4[1]-s2[1]];

    function _lerp(fx, fy) {
      let f = [
        (dx[0]*fx + dy[0]*fy) + s2[0],
        (dx[1]*fx + dy[1]*fy) + s2[1],
      ];
      return(_fromSpher(f));
    }

    for(let f = 0.1; f <1; f+=0.1) {
      group.add(this.makeball(_lerp(f, 0), 0xff0000));
      group.add(this.makeball(_lerp(0, f), 0x00ff00));
    }

    group.add(this.makeball(w0, 0x8844ff));
    group.add(this.makeball(w2, 0x8844ff));
    group.add(this.makeball(w4, 0x8844ff));

    return group;
  }

  _setPosV(obj, position) {
    return position ?
      this._setPos(obj, position.x, position.y, position.z) :
      obj;
  }

  _setPos(obj, x, y, z) {
    obj.position.set(x, y, z);
    return obj;
  }

  _fromSpher(theta, phi) {
    return new three.Vector3(
        Math.cos(phi) * Math.cos(-theta),
        Math.sin(phi),
        Math.cos(phi) * Math.sin(-theta),
    );
  }

  _makeball(radius = 0.1, color = 0xaa3300) {
    const geo = new three.SphereGeometry(radius);
    const mat = new three.MeshPhongMaterial({color: color,});
    const mesh = new three.Mesh(geo, mat);
    this.myscene.res3.add(mesh);
    return mesh;
  }

  makeball(position, color = 0x996600) {
    const ball = this._makeball(0.15, color);
    return this._setPosV(ball, position);
  }
}
