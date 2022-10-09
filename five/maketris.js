import Delaunator from '../lib/delaunator.js';

// Given an input of verts [[x,y,z], ...]
// return a list of triangle indexes [[0,1,2], [1,2,3], ...]

export class MakeTris {
  constructor() {
  }

  make(verts) {
  }

  make1(verts) {
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
