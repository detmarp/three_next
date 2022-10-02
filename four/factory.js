import * as three from '../threejs/build/three.module.js';
import {Tiler} from './tiler.js';

export class Factory {
  constructor(myscene) {
    this.myscene = myscene;
    this.tiler = new Tiler(this.myscene);
  }

  make(params={}) {
    if (params.form == 'tile') {
      return this.tiler.make(params.coord, params);
    }

    let geo = this.makeGeometry();

    let mat = this.makeMaterial(params);

    let mesh = this.makeMesh(geo, mat);

    params.rot ??= [Math.PI * -0.5, 0, 0];
    this.orient(mesh, params);

    this.add(mesh);
    return mesh;
  }

  makeGeometry() {
    let geometry = new three.PlaneGeometry(10, 10);
    return geometry;
  }

  makeMaterial(params) {
    let color = params.color ?? 0xff00ff;
    let material = new three.MeshPhongMaterial({ color: color });
    return material;
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
