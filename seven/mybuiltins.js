import * as three from '../threejs/build/three.module.js';

export class MyBuiltins {
  // Loader for a bunch of test objects.

  constructor(res3) {
    this.res3 = res3;
  }

  load(name, params = {}) {
    switch (name) {
      case 'bluesky': return this.bluesky(params);
      case 'object': return this.object(params);
      case 'ball': return this.ball(params);
      case 'cube': return this.cube(params);
    }
  }

  object(params={}) {
    let obj = new three.Object3D();
    this._setupObject(obj, params)
    return obj;
  }

  ball(params={}) {
    let mat = new three.MeshPhongMaterial({color: 0xee4400,});
    let radius = 0.5;
    let geo = new three.SphereGeometry(radius);
    const mesh = new three.Mesh(geo, mat);
    this._setupObject(mesh, params)
    return mesh;
  }

  cube(params={}) {
    let mat = new three.MeshPhongMaterial({color: 0xee4400,});
    let edge = 1;
    let geo = new three.BoxGeometry(edge, edge, edge);
    const mesh = new three.Mesh(geo, mat);
    this._setupObject(mesh, params)
    return mesh;
  }

  bluesky(params={}) {
    // A blue-patterned skybox.
    if (!this.cubeLoader) {
      this.cubeLoader = new three.CubeTextureLoader();
    }

    const texture = this.cubeLoader.load([
      'https://i.imgur.com/U2JKGpH.png', // - s
      'https://i.imgur.com/ZhiviQI.png', // - n
      'https://i.imgur.com/C0XxEpF.png', // - u
      'https://i.imgur.com/TPLV8ez.png', // - d
      'https://i.imgur.com/M2H0EHR.png', // - e
      'https://i.imgur.com/787nQas.png', // - w
    ]);
    this.res3.add(texture);
    return texture;
  }

  _setupObject(obj, params) {
    this.res3.add(obj);
    if (params.parent) {
      params.parent.add(obj);
    }
  }
}
