import * as three from '../threejs/build/three.module.js';
import {MyScene} from './myscene.js';
import {EzUi} from './ezui.js';

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

    var floor = new three.Mesh(
      new three.PlaneGeometry(6, 6),
      new three.MeshPhongMaterial({ color: 0x114400 }));
    floor.position.set(0, 0, 0);
    floor.rotation.x = Math.PI * -0.5;
    this.myscene.root.add(floor);

    let ui = new EzUi();

    let c = 0;
    let a = ui.addButton('butt', () => {
      c += 1;
      ui.updateText(a, `butt ${c}`);
      ui.updateText(b, `text ${c}`);
    });
    let b = ui.addText('foo');

    this.myscene.run();
  }
}
