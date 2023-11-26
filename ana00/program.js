import {Program as Program03} from '../ana03/program.js';
import {Program as Program04} from '../ana04/program.js';

export class Program {
  constructor(root) {
    this.root = root;
    this.clocks = new Map();
  }

  makeCell(useCanvas) {
    let id = this.clockId;
    this.clockId += 1;

    let info = new Map();
    info.id = id;
    info.onCanvas = useCanvas;
    this.clocks[id] = info;

    let x = document.createElement('text');
    x.className = 'clockcell';
    x.innerHTML = 'hey';
    x.style.width = '120px';
    x.style.height = '120px';
    let self = this;
    x.addEventListener('click', () => {
      self.onCellClick(id);
    }, false);
    this.cells.appendChild(x);

    let c = document.createElement('canvas');
    x.replaceChildren(c);

    useCanvas(c);

    return x;
  }

  onCellClick(id) {
    this.debugText(`clicked ${id}`);
    let info = this.clocks[id];
    this.setBigClock(info.onCanvas);
  }

  makeElement(type, parent, inner) {
    let e = document.createElement(type);
    if (parent) {
      parent.appendChild(e);
    }
    if (inner) {
      e.innerHTML = inner;
    }
    return e;
  }

  makeTree() {
    this.root.replaceChildren();

    this.top = this.makeElement('div', this.root);
    this.top.style.position = 'relative';

    this.big = this.makeElement('div', this.top);
    this.big.style.position = 'absolute';

    this.cells = this.makeElement('div', this.top);
    this.cells.style.position = 'absolute';

    this.text = this.makeElement('div', this.top);
    this.text.style.position = 'absolute';
  }

  setup() {
    this.clockId = 0;
    this.clocks.clear();

    this.makeTree();

    this.makeCell(canvas => {
      let p = new Program03(canvas);
      p.run();
    });

    this.makeCell(canvas => {
      let p = new Program04(canvas);
      p.run();
    });

    this.debugText('asdf');
  }

  run() {
    this.setup();
  }

  debugText(text) {
    this.text.innerHTML = text;
  }

  setBigClock(onCanvas) {
    this.big.replaceChildren();

    let big = this.makeElement('div', this.big);
    big.className = 'bigdiv';
    big.style.width = '520px';
    big.style.height = '520px';

    let canvas = this.makeElement('canvas', big);
    onCanvas(canvas);
  }
}
