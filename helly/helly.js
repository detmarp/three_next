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
          this.parseHelly(json.helly);
        }
        this._onLoadingDone();
        return json;
      })
      .catch(error => {
        this._onLoadingDone();
        throw error;
      });
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

  draw(drawable, position, alpha) {
    if (typeof drawable === 'string') {
      if (this.sprites.has(drawable)) {
        this.drawSprite(this.sprites.get(drawable), position, alpha);
        return;
      }
      if (this.anims.has(drawable)) {
        this.drawAnim(this.anims.get(drawable), position, alpha);
        return;
      }
    }

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

  drawSprite(sprite, position = [0,0], alpha = 1) {
    if (!sprite.image && sprite.imageName) {
      sprite.image = this.images.get(sprite.imageName);
      return;
    }
    if (!sprite.image) {
      this.drawColor(position, sprite.size);
      return;
    }
    this.context.globalAlpha = alpha;
    const source = sprite.source;
    let offset = sprite.offset || [0, 0];
    this.context.drawImage(sprite.image,
      ...source,
      ...sprite.size,
      position[0] - offset[0], position[1] - offset[1],
      ...sprite.size);
    this.context.globalAlpha = 1;
    }

  drawAnim(anim, position = [0,0], alpha) {
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
      this.draw(nextFrame, position, f);
    }
  }

  parseHelly(hellyDef) {
    let imageName = hellyDef.imageName;
    if (hellyDef.sprites) {
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
