export default class Helly extends EventTarget {
  constructor(context) {
    super();
    this.context = context;

    this.images = new Map();
    this.jsons = new Map();
    this.sprites = new Map();
    this.loadCount = 0;
    this.loading = 0;
  }

  drawSquare(x, y, size, color) {
    this.context.fillStyle = color;
    this.context.fillRect(x, y, size, size);
  }

  loadImage(filename) {
    this.loading++;
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        const key = filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
        this.images.set(key, image);
        this.loadCount++;
        this.onLoadingDone();
        resolve(image);
      };
      image.onerror = (error) => {
        this.onLoadingDone();
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
        this.onLoadingDone();
        return json;
      })
      .catch(error => {
        this.onLoadingDone();
        throw error;
      });
  }

  onLoadingDone() {
    this.loading--;
    if (this.loading === 0) {
      this.dispatchEvent(new Event('loadingdone'));
    }
  }

  draw(drawable, position) {
    if (typeof drawable === 'string' && this.sprites.has(drawable)) {
      this.drawSprite(this.sprites.get(drawable), position);
      return;
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

  drawSprite(sprite, position = [0,0]) {
    if (!sprite.image && sprite.imageName) {
      sprite.image = this.images.get(sprite.imageName);
      return;
    }
    if (!sprite.image) {
      this.drawColor(position, sprite.size);
      return;
    }
    const source = sprite.source;
    let offset = sprite.offset || [0, 0];
    this.context.drawImage(sprite.image,
      ...source,
      ...sprite.size,
      position[0] - offset[0], position[1] - offset[1],
      ...sprite.size);
  }

  parseHelly(hellyDef) {
    let imageName = hellyDef.imageName;
    if (hellyDef.sprites) {
      for (const [key, value] of Object.entries(hellyDef.sprites)) {
        value.imageName = value.imageName || imageName;
        this.sprites.set(key, value);
      }
    }
  }
}
