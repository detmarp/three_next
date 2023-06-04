import * as three from '../threejs/build/three.module.js';
import {MyScene} from './myscene.js';
import {EzUi} from './ezui.js';
import {MyBuiltins} from './mybuiltins.js';

export class Program {
  constructor() {
    this.myscene = new MyScene();
  }

  run() {
    this.myscene.init();

    this.builtins = new MyBuiltins(this.myscene.res3);

    this.setup();

    this.createHud();
    this.myscene.addCallback(() => {this.updateHud();});

    this.myscene.run();
  }

  setup(shape='ball') {
    this.sky = this.builtins.bluesky();
    this.myscene.rootScene.background = this.sky;

    this.root = this.builtins.object({parent:this.myscene.rootScene});
    this.builtins.load(shape, {parent:this.root});
  }

  reset(shape) {
    if (this.sky) {
      this.myscene.res3.destroy(this.sky);
      this.sky = null;
      this.myscene.rootScene.background = null;
    }

    this.myscene.res3.destroy(this.root);
    this.root = null;

    this.myscene.cameraman.reset();

    this.setup(shape);
  }

  createHud() {
    this.ui = new EzUi();
    this.info = this.ui.addText();
    this.ui.addButton('Ball', () => {this.reset('ball');});
    this.ui.addText();
    this.ui.addButton('Cube', () => {this.reset('cube');});
    this.ui.addText();
    this.ui.addButton('1', () => {
      fetch('./data1.json')
      .then((response) => response.json())
      .then((json) => this.x = json.x);
      });
    this.ui.addButton('2', () => {
      fetch('./data2.json')
      .then((response) => response.json())
      .then((json) => this.x = json.x);
      });
  }

  updateHud() {
    this.ui.updateText(
      this.info,
      `hey<br>` +
      `workers:${this.myscene.workers.size}<br>` +
      `res:${this.myscene.res3.count}/${this.myscene.res3.id}<br>` +
      `x:${this.x}<br>` +
      `renderer:${this.myscene.renderer.info}<br>` + // TODO - show more info
      ``
    );
  }
}
