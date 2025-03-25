export default class DrawCard {
  constructor(iris) {
    this.iris = iris;
    this.context = iris.context;
  }

  render() {
    this.iris.helly.draw('critter0', [160, 518]);
    this.iris.helly.draw('critter1', [200, 518]);
    this.iris.helly.draw('critter2', [240, 518]);
    this.iris.helly.draw('critter3', [280, 518]);
    this.iris.helly.draw('critter4', [320, 518]);
    this.iris.helly.draw('critter5', [360, 518]);
    this.iris.helly.draw('critter6', [400, 518]);
  }
}