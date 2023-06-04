import * as three from '../threejs/build/three.module.js';
import {MyScene} from './myscene.js';
import {EzUi} from './ezui.js';
import {Part1} from './part1.js';
import {MyBuiltins} from './mybuiltins.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
  }

  run() {
    this.myscene.init();
    this.setup();
    this.myscene.run();
  }

  setup() {
    this.builtins = new MyBuiltins();

    this.myscene.rootScene.background = this.builtins.load('bluebox');

    this.n = 6;
    this.part1 = new Part1(this.myscene, this.n);

    this.createHud();
    this.myscene.addCallback(() => {this.updateHud();});
  }

  reset() {
    this.n = 6;
    this.part1.reset(this.n);
    this.myscene.cameraman.reset();
  }

  createHud() {
    this.ui = new EzUi();
    this.info = this.ui.addText();
    this.ui.addButton('Reset', () => {this.reset();});
    this.ui.addText();
    this.ui.addButton('-', () => {
      this.n = Math.max(this.n - 1, 1);
      this.part1.reset(this.n);
    });
    this.ui.addButton('+', () => {
      this.n = this.n + 1;
      this.part1.reset(this.n);
    });
  }

  updateHud() {
    this.ui.updateText(
      this.info,
      `hey<br>` +
      `workers:${this.myscene.workers.size}<br>` +
      `res:${this.myscene.res3.count}/${this.myscene.res3.id}<br>` +
      `stats:${JSON.stringify(this.part1.hexer.stats)}`
    );
  }
}
