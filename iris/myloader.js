export default class MyLoader {
  // A sequential loader class
  // To use, make calls to begin(func),
  //   and each func needs to call end() when it's done.
  // Then call waitForAll(callback) to finish

  constructor() {
    this.queue = [];
    this.isRunning = false;
    this.pendingCount = 0;
    this.onComplete = null;
  }

  static microTask(func, callback) {
    // a static helper
    queueMicrotask(() => {
      try {
        let result = func();
        if (callback) callback(result);
      } catch (error) {
        console.error('eee Error in microTask:', error);
        if (callback) callback(error);
      }
    });
  }

  begin(func) {
    this.queue.push(func);
    this.pendingCount++;
    this._processNext();
  }

  end() {
    this.pendingCount--;
    this.isRunning = false;
    this._processNext();
  }

  waitForAll(callback) {
    if (!this.isRunning && this.queue.length === 0) {
      MyLoader.microTask(callback);
    }
    else {
      this.onComplete = callback;
    }
  }

  _processNext() {
    if (this.queue.length === 0) {
      if (this.onComplete) {
        MyLoader.microTask(this.onComplete);
      }
    }
    else {
      if (!this.isRunning) {
        const func = this.queue.shift();
        this.isRunning = true;
        this.pendingEnd++;
        MyLoader.microTask(func);
      }
    }
  }
}
