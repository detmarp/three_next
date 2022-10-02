import * as three from '../threejs/build/three.module.js';

// A system for making ground tiles.
export class Tiler {
  constructor(myscene) {
    this.myscene = myscene;
    this.size = 10;
    this.yScale = .25;
    this.grid = 10;
    this.materials = [
      new three.MeshPhongMaterial({ color: 0x00aa00 }),
    ]
  }

  make(coord, params={}) {
    /*
      params:
        verts: list of [x,y,z], where x and z are range [0,10]
        faces: list of [v0,v1,v2]
    */
    // make our own local vert list first.
    // verts with origin in lower left.  We will move these to coord later.
    let vs = [
      [0, 0, 0],
      [this.grid, 0, 0],
      [0, 0, this.grid],
      [this.grid, 0, this.grid],
    ];
    if (params.verts) {
      params.verts.forEach(v => {
        let i = v.length;
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
    geo.faces.push(new three.Face3(0, 2, 1));
    geo.faces.push(new three.Face3(1, 2, 3));

    geo.computeFaceNormals();

    let mat = this.makeMaterial(0);

    let mesh = new three.Mesh(geo, mat);

    //mesh.rotation.x = Math.PI * -0.5;

    this.add(mesh);
    return mesh;
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

  add(mesh) {
    this.myscene.root.add(mesh);
  }
}
