import * as three from '../threejs/build/three.module.js';
import {MyScene} from './myscene.js';
import {EzUi} from './ezui.js';
import {Part1} from './part1.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
  }

  run() {
    this.myscene.init();

    const loader = new three.CubeTextureLoader();
    const texture = loader.load([
      'https://i.imgur.com/U2JKGpH.png', // - s
      'https://i.imgur.com/ZhiviQI.png', // - n
      'https://i.imgur.com/C0XxEpF.png', // - u
      'https://i.imgur.com/TPLV8ez.png', // - d
      'https://i.imgur.com/M2H0EHR.png', // - e
      'https://i.imgur.com/787nQas.png', // - w
    ]);
    this.myscene.root.background = texture;

    this.ui = new EzUi();

    this.info = this.ui.addText();
    this.myscene.addCallback(() => {this.updateHud();});

    this.n = 6;
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

    this.part1 = new Part1(this.myscene, this.n);

    this.myscene.run();
  }

  reset() {
    this.n = 6;
    this.part1.reset(this.n);
    this.myscene.cameraman.reset();
  }

  updateHud() {
    this.ui.updateText(
      this.info,
      `workers:${this.myscene.workers.size}<br>` +
      `res:${this.myscene.res3.count}/${this.myscene.res3.id}<br>` +
      `stats:${JSON.stringify(this.part1.hexer.stats)}`
    );
  }
}
