// Version 2025-03-26

import HellyLoad from './hellyload.js';

export default class Helly extends EventTarget {
  constructor(context) {
    super();
    this.context = context;

    this.images = new Map();
    this.jsons = new Map();
    this.sprites = new Map();
    this.anims = new Map();
    this.loadCount = 0;
    this.loading = 0;
    this.time = 0;
    this.dt = 0;

    this.hellyLoad = new HellyLoad();
    this.hellyLoad.onAllLoaded = () => {
      this.dispatchEvent(new Event('loadingdone'));
    }
    this.hellyLoad.onError = (filename, error) => {
      console.error(`ERROR: loading ${filename} - ${error}`);
    }
    this.hellyLoad.defineType('image', ['png', 'jpg', 'jpeg', 'gif'], (image, type, key) => {
      //console.log(`pretending to handle ccc ${image.type} ${type} ${key}`);
      this.images.set(key, image);
    });
    this.hellyLoad.defineType('json', ['json'], (ob, type, baseFileName, fileName) => {
      //console.log(`pretending to handle bbb ${ob.type} ${type} ${baseFileName} ${fileName}`);
      this.parentPath = fileName.substring(0, fileName.lastIndexOf('/'));
      //console.log(`ddd Parent path: ${this.parentPath}`);
      this._onLoadJson(ob);
    });
  }

  load(filename, type) {
    //console.log(`aaa ${filename} ${type}`);
    this.hellyLoad.load(filename, type);
  }

  loadImage(filename) {
    this.loading++;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const key = filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
        this.images.set(key, image);
        this.loadCount++;
        this._onLoadingDone();
        resolve(image);
      };
      image.onerror = (error) => {
        this._onLoadingDone();
        reject(error);
      };
      image.src = filename;
    });
  }

  loadJson(filename) {
    this.loading++;
    return fetch(filename)
      .then(response => response.json())
      .then(json => {
        const key = filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
        this.jsons.set(key, json);
        this.loadCount++;
        if (json && typeof json === 'object' && json.helly) {
          this._parseHelly(json.helly);
        }
        this._onLoadingDone();
        return json;
      })
      .catch(error => {
        this._onLoadingDone();
        throw error;
      });
  }

  _onLoadJson(ob) {
    if (ob.helly) {
      this._parseHelly(ob.helly);
    }
  }

  _onLoadingDone() {
    this.loading--;
    if (this.loading === 0) {
      this.dispatchEvent(new Event('loadingdone'));
    }
  }

  startFrame(dt) {
    this.dt = dt;
    this.time += dt;
  }

  draw(drawable, position, meta) {
    if (typeof drawable === 'string') {
      if (this.sprites.has(drawable)) {
        this.drawSprite(this.sprites.get(drawable), position, meta);
        return;
      }
      if (this.anims.has(drawable)) {
        this.drawAnim(this.anims.get(drawable), position, meta);
        return;
      }
    }

    position = position || this._getMetaData(null, meta, 'position') || [0, 0];
    if (drawable !== null && typeof drawable === 'object') {
      if (drawable.type === 'image') {
        this.context.drawImage(this.images.get(drawable.image), ...position);
      }
    }
    const size = drawable && drawable.size ? drawable.size : [8, 8];
    const color = drawable && drawable.color ? drawable.color : 'magenta';
    this.drawColor(position, size, color);
  }

  drawColor(position = [0, 0], size = [8, 8], color = 'magenta') {
    this.context.fillStyle = color;
    this.context.fillRect(...position, ...size);
  }

  drawSprite(sprite, position, meta) {
    if (!sprite.image && sprite.imageName) {
      sprite.image = this.images.get(sprite.imageName);
      return;
    }
    position = position || this._getMetaData(sprite, meta, 'position') || [0, 0];
    if (!sprite.image) {
      this.drawColor(position, sprite.size);
      return;
    }

    let alpha = this._getMetaData(sprite, meta, 'alpha') ?? 1;
    let scale = this._getMetaData(sprite, meta, 'scale') ?? 1;
    let scalex = scale;
    let scaley = scale;
    if (this._getMetaData(sprite, meta, 'hflip')) scalex *= -1;
    let offset = sprite.offset || [0, 0];
    let angle = this._getMetaData(sprite, meta, 'rotate') || 0;

    const source = sprite.source;

    let destSize = [sprite.size[0] * scalex, sprite.size[1] * scaley];

    this.context.save();
    this.context.globalAlpha = alpha;
    this.context.translate(...position);
    this.context.scale(scalex, scaley);
    this.context.rotate(angle);
    this.context.drawImage(sprite.image,
      ...source,
      ...sprite.size,
      ...[-offset[0], -offset[1]],
      ...sprite.size
    );
    this.context.restore();
  }

  drawAnim(anim, position, meta) {
    let n = anim.frames.length;
    let fps = anim.fps || 10;
    let duration = 1 / fps;
    let f = (this.time % (duration * n)) * fps;
    let i = Math.floor(f);
    let j = (i + 1)  % n;
    f = f - i;
    let frame = anim.frames[i];
    this.draw(frame, position);
    if (anim.crossfade) {
      let nextFrame = anim.frames[j];
      this.draw(nextFrame, position, {alpha: f});
    }
  }

  _getMetaData(item, meta, key) {
    if (item && item.type === 'object' && key in item) {
      return item[key];
    }
    if (meta && key in meta) {
      return meta[key];
    }
  }

  _parseHelly(hellyDef) {
    if (hellyDef.files) {
      for (const file of hellyDef.files) {
        if (file.name) {
          let filename = this.parentPath + '/' + file.name;
          this.load(filename, file.type);
        }
      }
    }
    if (hellyDef.sprites) {
      let imageName = hellyDef.imageName;
      for (const [key, value] of Object.entries(hellyDef.sprites)) {
        value.imageName = value.imageName || imageName;
        this.sprites.set(key, value);
      }
    }
    if (hellyDef.anims) {
      for (const [key, value] of Object.entries(hellyDef.anims)) {
        this.anims.set(key, value);
      }
    }
  }
}
