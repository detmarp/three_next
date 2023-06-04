import * as three from '../threejs/build/three.module.js';

export class Res3 {
  // A class for managing three js resources.
  // Not too complex; helps with disposing of 3d resources.

  constructor() {
    this.id = 0;
    this.count = 0;
  }

  add(obj) {
    // Track this object.
    // If it has geo or materials that are not yet tracked, then track them.
    if (!obj._res3id) {
      obj._res3id = ++this.id;
      this.count++;
      // In case this is a 3d object with material and geometry, try to track.
      this._track(obj, obj.material);
      this._track(obj, obj.geometry);
    }
  }

  destroy(obj, noremove) {
    // Recursively destroy children.
    // Dispose of resources.
    // Remove from parent.
    obj.children.forEach(c => { this.destroy(c, true); });
    if (obj._res3dresources) {
      obj._res3dresources.forEach(r => {
        r.dispose();
        this.count--;
      });
    }
    if (!noremove && obj.parent) {
      obj.parent.remove(obj);
    }
    if (obj._res3id) {
      this.count--;
    }
  }

  _track(obj, resource) {
    // Track this resource, on this object.
    if (resource && !resource._res3id) {
      if (!obj._res3dresources)  {
        obj._res3dresources = [];
      }
      resource._res3id = ++this.id;
      this.count++;
      obj._res3dresources.push(resource);
    }
  }
}
