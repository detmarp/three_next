import Dixie from "./dixie.js";

export default class Ui {
  constructor(program, root) {
    this.program = program;
    this.root = root;

    this.dixie = new Dixie(this.root);
  }
}
