import {Program as Program03} from '../ana03/program.js';
import {Program as Program04} from '../ana04/program.js';

export class Program {
  constructor(root) {
    this.root = root;
  }

  makeCell(useCanvas) {
    let x = document.createElement('text');
    x.className = 'clockcell';
    x.innerHTML = 'hey';
    x.style.width = '120px';
    x.style.height = '120px';
    this.root.appendChild(x);

    let c = document.createElement('canvas');
    x.replaceChildren(c);

    useCanvas(c);

    return x;
  }

  setup() {
    this.makeCell(canvas => {
      let p = new Program03(canvas);
      p.run();
    });

    this.makeCell(canvas => {
      let p = new Program04(canvas);
      p.run();
    });
  }

  run() {
    this.setup();
  }
}
