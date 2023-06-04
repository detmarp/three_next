import * as three from '../threejs/build/three.module.js';

export class MyBuiltins {
  // Loader for a bunch of test objects.

  constructor() {
  }

  load(name) {
    switch (name) {
      case 'bluebox': return this.bluebox();
    }
  }

  bluebox() {
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
    return texture;
  }
}
