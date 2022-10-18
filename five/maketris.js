import Delaunator from '../lib/delaunator.js';
import { Ddd } from '../lib/delaunay.js';

// Given an input of verts [[x,y,z], ...]
// return a list of triangle indexes [[0,1,2], [1,2,3], ...]

export class MakeTris {
  constructor() {
  }

  make(verts) {
    return this.make1(verts);
  }

  make1(verts) {
    let v = [];
    for (let i = 0; i < verts.length; i++) {
      v.push([verts[i][0], verts[i][2]]);
    }
    let t = Ddd.triangulate(v);

    let tris = [];
    for (let i = 0; i < t.length; i+= 3) {
      tris.push([t[i], t[i+1], t[i+2]]);
    }
    return tris;
  }

  make2(verts) {
  }

  make3(verts) {
    let delaunay = Delaunator.from(verts,
      verts => verts[0],
      verts => verts[2]
    );
    let t = delaunay.triangles;
    let tris = [];
    for (let i = 0; i < t.length; i+= 3) {
      tris.push([t[i], t[i+1], t[i+2]]);
    }
    return tris;
  }
}
