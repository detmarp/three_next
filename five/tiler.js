import * as three from '../threejs/build/three.module.js';
import Delaunator from '../lib/delaunator.js';

// A system for making ground tiles.
export class Tiler {
  constructor(myscene) {
    this.myscene = myscene;
    this.size = 10;
    this.yScale = .05;
    this.grid = 10;
    this.materials = [
      new three.MeshPhongMaterial({ color: 0x000066,
        polygonOffset: true,
        polygonOffsetFactor: 1, // positive value pushes polygon further away
        polygonOffsetUnits: 1
      }),
      new three.MeshPhongMaterial({ color: 0x00aa00,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      new three.MeshPhongMaterial({ color: 0x998855,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      new three.MeshPhongMaterial({ color: 0x773300,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      new three.MeshPhongMaterial({ color: 0x444444,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
      new three.MeshPhongMaterial({ color: 0xccccff,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      }),
    ]
  }

  mmm(coord, params={}) {
    let group = new three.Object3D();

    let geo = new three.Geometry();

    let vs = [];
    for (let i = 0; i < 256; i++) {
      let v = [
        Math.random() * this.grid,
        Math.random() * 50,
        Math.random() * this.grid,
      ];
      vs.push(v);
    }
    vs.forEach(v => {
      geo.vertices.push(this.makeVert(coord, v));
    });

    let delaunay = Delaunator.from(vs, v => v[0], v => v[2]);
    let t = delaunay.triangles;
    for (let i = 0; i < t.length; i+=3) {
      geo.faces.push(new three.Face3(t[i], t[i+1], t[i+2]));
    }

    geo.computeFaceNormals();

    let mat = this.makeMaterial(Math.floor(Math.random() * 6));

    let mesh = new three.Mesh(geo, mat);

    group.add(mesh);

    this.myscene.root.add(group);
    return group;

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
