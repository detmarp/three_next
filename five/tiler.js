import * as three from '../threejs/build/three.module.js';
import { MakeTris } from './maketris.js';

// A system for making ground tiles.
export class Tiler {
  constructor(myscene) {
    this.myscene = myscene;
    this.size = 10;
    this.yScale = .01;
    this.grid = 10;
    this.materials = [
      // 0 sea
      new three.MeshPhongMaterial({ color: 0x000066,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
      }),
      // 1 green A
      new three.MeshPhongMaterial({ color: 0x00aa00,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      // 2 green B
      new three.MeshPhongMaterial({ color: 0x009900,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      // 1 green C
      new three.MeshPhongMaterial({ color: 0x007700,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      // 4 sand
      new three.MeshPhongMaterial({ color: 0x998855,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      // 5 dirt
      new three.MeshPhongMaterial({ color: 0x773300,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      // 6 rock
      new three.MeshPhongMaterial({ color: 0x444444,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      // 7 ice
      new three.MeshPhongMaterial({ color: 0xccccff,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
    ]
  }

  mmm(coord, params={}) {
    let group = new three.Object3D();

    let vs = params.verts;
    let vertices = [];
    params.verts.forEach(v => {
      vertices.push(this.makeVert(coord, v));
    });

    let sets = new Map();

    let makeTris = new MakeTris();
    let t = makeTris.make(vs);

    for (let i = 0; i < t.length; i++) {
      let tri = t[i];
      let c = this.getMaterial(vs[tri[0]][3], vs[tri[1]][3], vs[tri[2]][3]);
      if (!sets.has(c)) {
        let g = new three.Geometry();
        g.vertices = vertices;
        sets.set(c, g);
      }
      sets.get(c).faces.push(new three.Face3(tri[0], tri[1], tri[2]));
    }
    sets.forEach((v, k) => {
      v.computeFaceNormals();
      let mat = this.makeMaterial(k);
      let mesh = new three.Mesh(v, mat);
      group.add(mesh);
    });

    this.myscene.root.add(group);
    return group;

  }

  getMaterial(c0, c1, c2) {
    let sea = (c0 == 0 && c0 == c1 && c0 == c2);
    let c = (c1 == c2) ? c1 : c0;
    if (c == 0 && !sea) {
      c = 4;
    }
    return c;
  }

  make(coord, params={}) {
    return this.mmm(coord, params);
    /*
      params:
        verts: list of [x,y,z], where x and z are range [0,10]
        faces: list of [v0,v1,v2]
    */
    // make our own local vert list first.
    // verts with origin in lower left.  We will move these to coord later.
    let group = new three.Object3D();
    let material = params.material ?? 3;

    let vs = [
      [0, 0, 0],
      [this.grid, 0, 0],
      [0, 0, this.grid],
      [this.grid, 0, this.grid],
    ];
    if (params.verts) {
      params.verts.forEach(v => {
        let i = vs.length;
        if (v[0] == 0 && v[2] == 0) {
          i = 0;
        }
        else if (v[0] == this.grid && v[2] == 0) {
          i = 1;
        }
        else if (v[0] == 0 && v[2] == this.grid) {
          i = 2;
        }
        else if (v[0] == this.grid && v[2] == this.grid) {
          i = 3;
        }
        vs[i] = v;
      });
    }

    // Make the geo.
    let geo = new three.Geometry();

    // Transform each verts[], and add to geo.
    vs.forEach(v => {
      geo.vertices.push(this.makeVert(coord, v));
    });
    if (params.faces) {
      params.faces.forEach(f => {
        geo.faces.push(new three.Face3(f[0], f[1], f[2]));
      });
    }
    else {
      geo.faces.push(new three.Face3(0, 2, 1));
      geo.faces.push(new three.Face3(1, 2, 3));
    }

    geo.computeFaceNormals();

    let mat = this.makeMaterial(material);

    let mesh = new three.Mesh(geo, mat);

    group.add(mesh);

    ////
    let gg = new three.WireframeGeometry(geo); // or WireframeGeometry
    var mm = new three.LineBasicMaterial( { color: 0xffffff,
    } );
    var ee = new three.LineSegments( gg, mm );
    group.add(ee);
    ////

    this.myscene.root.add(group);
    return group;
  }

  makeVert(coord, position) {
    let scale = this.size / this.grid;
    let v = new three.Vector3(
      (coord[0] * this.grid + position[0]) * scale,
      position[1] * this.yScale,
      (coord[1] * this.grid + position[2]) * scale
    );
    return v;
  }

  makeGeometry() {
    let geometry = new three.PlaneGeometry(10, 10);
    return geometry;
  }

  makeMaterial(i) {
    return this.materials[i];
  }

  makeMesh(geometry, material) {
    let mesh = new three.Mesh(geometry, material);
    return mesh;
  }

  orient(mesh, params={}) {
    if (params.xz) {
      mesh.position.set(params.xz[0], 0, params.xz[1]);
    }
    if (params.rot) {
      mesh.rotation.x = params.rot[0];
      mesh.rotation.y = params.rot[1];
      mesh.rotation.z = params.rot[2];
    }
    return mesh;
  }
}
