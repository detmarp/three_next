// newloader.js

export default class newLoader {
  constructor() {
    this.assets = {};
    this.images = {};
    this._loadingPromises = {};
  }

  _getLeafFilename(url) {
    if (!url) return null;
    const parts = url.split('/');
    return parts[parts.length - 1];
  }

  _inferTypeFromUrl(url) {
    const extension = url.split('.').pop().toLowerCase();
    switch (extension) {
      case 'json':
        return 'json';
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'webp':
        return 'image';
      default:
        throw new Error(`Cannot infer resource type from extension: "${extension}" in URL: "${url}".`);
    }
  }

  async load(url, callback = null) {
    const filename = this._getLeafFilename(url);
    let type;
    try {
      type = this._inferTypeFromUrl(url);
    } catch (error) {
      console.error(`Error inferring type for resource "${filename}" (${url}):`, error.message);
      this.assets[filename] = { error: error.message };
      if (typeof callback === 'function') {
        await Promise.resolve(callback(this.assets[filename])); // Pass only the new asset
      }
      return Promise.resolve(null);
    }

    if (this._loadingPromises[filename]) {
      console.warn(`Resource "${filename}" is already loading.`);
      return this._loadingPromises[filename];
    }
    if (this.assets[filename]) {
      if (this.assets[filename].error) {
        console.warn(`Resource "${filename}" previously failed to load.`);
        if (typeof callback === 'function') {
          await Promise.resolve(callback(this.assets[filename])); // Pass only the existing asset
        }
        return Promise.resolve(null);
      }
      console.warn(`Resource "${filename}" already exists in assets.`);
      if (typeof callback === 'function') {
        await Promise.resolve(callback(this.assets[filename])); // Pass only the existing asset
      }
      return Promise.resolve(this.assets[filename].object);
    }

    console.log(`Starting load for: "${filename}" (inferred type: ${type}) from ${url}`);

    const loadPromise = (async () => {
      let loadedObject = null;
      let originalJsonText = undefined;

      try {
        if (type === 'json') {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} for ${url}`);
          }
          originalJsonText = await response.text();
          loadedObject = JSON.parse(originalJsonText);
        } else if (type === 'image') {
          loadedObject = await new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
            img.src = url;
          });
        } else {
          throw new Error(`Unsupported or unknown resource type: ${type}`);
        }

        this.assets[filename] = {
          object: loadedObject,
          image: type === 'image' ? loadedObject : undefined,
          json: type === 'json' ? originalJsonText : undefined
        };

        if (type === 'image') {
          this.images[filename] = loadedObject;
        }
        console.log(`Finished load for: "${filename}"`);
        return loadedObject;

      } catch (error) {
        console.error(`Error loading resource "${filename}" (${url}):`, error.message);
        this.assets[filename] = { error: error.message };
        return null;
      } finally {
        delete this._loadingPromises[filename];
        if (typeof callback === 'function') {
          await Promise.resolve(callback(this.assets[filename])); // Pass only the new asset
        }
      }
    })();

    this._loadingPromises[filename] = loadPromise;
    return loadPromise;
  }

  async wait(callback) {
    if (typeof callback !== 'function') {
      console.error("Wait method requires a callback function.");
      return Promise.reject(new Error("Callback required for wait method."));
    }

    const currentLoads = Object.values(this._loadingPromises);

    if (currentLoads.length === 0) {
      console.log("No active loads to wait for. Executing wait callback immediately.");
      try {
        await Promise.resolve(callback(this.assets));
      } catch (e) {
        console.error("Error in wait callback:", e);
      }
      return;
    }

    console.log(`Waiting for ${currentLoads.length} active loads to complete...`);

    try {
      await Promise.all(currentLoads);
      console.log("All current loads finished. Executing wait callback.");
      await Promise.resolve(callback(this.assets));
    } catch (error) {
      console.error("An unexpected error occurred while waiting for loads:", error);
      try {
        await Promise.resolve(callback(this.assets));
      } catch (e) {
        console.error("Error in wait callback after unexpected wait error:", e);
      }
    }
  }
}