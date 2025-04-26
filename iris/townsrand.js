export default class TownsRand {
  constructor(seed = Math.floor(Math.random() * 0x7fffffff)) {
    this.seed = seed;
    this.state = 0;
  }

  next() {
    this.state = (this.state * 48271 + this.seed + 123456789) & 0xfffffff;
    return this.state & 0x7fff;
  }

  rand(max) {
    return Math.floor((this.next() * max) / 0x7fff);
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = this.rand(i + 1);
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  toObject() {
    return {
      seed: this.seed,
      state: this.state
    };
  }

  static fromObject(obj) {
    const instance = new TownsRand(obj.seed);
    instance.state = obj.state;
    return instance;
  }
}