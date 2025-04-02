// A drawing helper for city card patterns
// The square shapes on the card face
export default class Pattern {
  constructor(shape) {
    this.shape = shape;
    this.colors = {
      y: '#fab535',
      r: '#f65f44',
      c: '#006f9c', // cyan
      g: '#8d8270',
      b: '#482f2a', // brown
    };
  }

  rotate() {
    const newShape = [];
    for (let i = 0; i < this.shape[0].length; i++) {
      newShape.push([]);
      for (let j = this.shape.length - 1; j >= 0; j--) {
        newShape[i].push(this.shape[j][i]);
      }
    }
    this.shape = newShape;
  }

  draw(context, position) {
    const w = Math.max(...this.shape.map(row => row.length));
    const h = this.shape.length;
    const max = Math.max(w, h);
    const size = 23;
    const x = position[0] - w * size / 2;
    const y = position[1] - h * size / 2;

    this.shape.forEach((row, rowIndex) => {
      [...row].forEach((char, charIndex) => {
        if (char === '-') return;
        const color = this.colors[char] || 'magenta';
        context.fillStyle = 'white';
        context.fillRect(x + charIndex * size, y + rowIndex * size, size, size);
        context.fillStyle = color;
        context.fillRect(x + charIndex * size + 1, y + rowIndex * size + 1, size - 2, size - 2);
      });
    });
  }
}
