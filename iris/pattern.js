// A drawing helper for city card patterns
export default class Pattern {
  constructor(shape) {
    this.shape = shape;
    this.colors = {
      y: '#eecc00',
      r: 'red',
      c: '#1155dd',
      g: 'gray',
      b: 'brown',
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
    const size = 19;
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
