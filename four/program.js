import {MyScene} from './myscene.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
  }

   run() {
     this.myscene.init();
     this.myscene.run();
  }
}
