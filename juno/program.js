import Solver from './solver.js';

export default class Program {
  constructor() {
    this.solver = new Solver();
    this.randomColors = [
      'rgb(255, 105, 180)', // Hot Pink
      'rgb(127, 255, 212)', // Aquamarine
      'rgb(90, 150, 180)', // Steel Blue
      'rgb(255, 0, 0)', // Red
      'rgb(0, 255, 0)', // Green
      'rgb(255, 255, 0)', // Yellow
      'rgb(0, 100, 255)', // Blue
      'rgb(255, 153, 0)', // Gold
      'rgb(168, 15, 228)', // Magenta
      'rgb(184, 115, 37)' // Light Cyan
    ];
  }

  run() {
    const frame = () => {
      this._frame();
      requestAnimationFrame(frame);
    };
    frame();
  }

  _frame() {
    this.solver.tryNext();
    this._fillBoard();
  }

  _fillBoard() {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 7; c++) {
        const value = this.solver.board[r][c];
        const color = value < 1 ? null : this.randomColors[value % this.randomColors.length];
        let id = `${c}${r}`;
        this._setColor(id, color);
      }
    }
  }

  _setColor(id, color) {
    const element = document.getElementById(id);
    if (element) {
      if (color === null) {
        element.style.backgroundColor = 'transparent';
        element.style.color = 'black';
      } else {
        element.style.backgroundColor = color;
        element.style.color = color;
      }
    }
  }
}
