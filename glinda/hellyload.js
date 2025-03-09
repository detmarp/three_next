// Version 2025-03-04

export default class HellyLoad {
  constructor() {
    this.types = new Map();
    this.queue = [];
  }

  onAllLoaded = () => {
  };

  onError = (filename, error) => {
    console.error(`ERROR: loading ${filename} - ${error}`);
  };

  defineType(type, extensions, callback) {
    this.types.set(type, { extensions, callback });
  }

  load(filename, type) {
    if (!type) {
      const extension = filename.substring(filename.lastIndexOf('.') + 1);
      for (let [key, value] of this.types.entries()) {
        if (value.extensions.includes(extension)) {
          type = key;
          break;
        }
      }
    }

    let empty = this.queue.length === 0;

    if (type && this.types.has(type)) {
      this.queue.push({ filename, type });
    } else {
      this.onError(filename, `Unknown type ${type}`);
    }

    if (empty) {
      this._loadNext();
    }
  }

  _loadNext() {
    if (this.queue.length === 0) {
      this.onAllLoaded();
      return;
    }

    const { filename, type } = this.queue.shift();
    const baseFilenameNoExt = filename.substring(filename.lastIndexOf('/') + 1, filename.lastIndexOf('.'));
    const typeInfo = this.types.get(type);

    if (type === 'image') {
      const image = new Image();
      image.onload = () => {
        typeInfo.callback(image, type, baseFilenameNoExt, filename);
        this._loadNext();
      };
      image.onerror = (error) => {
        this.onError(filename, error);
        this._loadNext();
      };
      image.src = filename;
    } else {
      fetch(filename)
        .then(response => {
          if (type === 'json') {
            return response.json();
          } else {
            return response.text();
          }
        })
        .then(data => {
          typeInfo.callback(data, type, baseFilenameNoExt, filename);
          this._loadNext();
        })
        .catch(error => {
          this.onError(filename, error);
          this._loadNext();
        });
    }
  }
}
