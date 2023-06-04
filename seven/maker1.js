import * as three from '../threejs/build/three.module.js';

export class Maker1 {
  // A class for making the graphics for a sphere.

  constructor(myscene, scale = 1) {
    this.myscene = myscene;
    this.scale = scale;

    this.materials = new Map();
    this._addMaterial(new three.MeshPhongMaterial({color: 0xee4400,}));
    this._addMaterial(new three.MeshPhongMaterial({color: 0x4400cc,}));

    let radius = this.scale * 0.55;
    this.ballGeo = new three.SphereGeometry(radius);
    this.myscene.res3.add(this.ballGeo);
  }

  destroy() {
    // TODO - destroy resources
    //this.myscene.res3.destroy(this.group);
  }

  material(type) {
    return this.materials.get(type % this.materials.size);
  }

  makeball(type = 0, position, group) {
    const geo = this.ballGeo;
    const mat = this.material(type);
    const mesh = new three.Mesh(geo, mat);
    this.myscene.res3.add(mesh);

    if (position) {
      mesh.position.set(position.x, position.y, position.z);
    }

    if(group) {
      group.add(mesh);
    }
    return mesh;
  }

  _addMaterial(material) {
    this.materials.set(this.materials.size, material);
    this.myscene.res3.add(material);
  }
}
