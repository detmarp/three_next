export default class DrawUtil {
  constructor(context, time) {
    this.context = context;
    this.time = time;
  }

  drawPickable(bounds) {
    const [x, y, w, h] = bounds;
    const { context } = this;

    const width = 2;
    const radius = 5;

    context.save();
    context.lineWidth = width;

    const color = this._lerpColor('red', 'green', this._sin(0.5) * 0.5 + 0.5);
    context.strokeStyle = color;

    // Draw rounded rectangle
    context.beginPath();
    context.moveTo(x + radius, y);
    context.lineTo(x + w - radius, y);
    context.quadraticCurveTo(x + w, y, x + w, y + radius);
    context.lineTo(x + w, y + h - radius);
    context.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    context.lineTo(x + radius, y + h);
    context.quadraticCurveTo(x, y + h, x, y + h - radius);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.closePath();

    context.stroke();
    context.restore();
  }

  _sin(period) {
    return Math.sin((2 * Math.PI * this.time) / period);
  }

  _lerpColor(colorA, colorB, t) {
    const [r1, g1, b1, a1] = this._colorToRgba(colorA);
    const [r2, g2, b2, a2] = this._colorToRgba(colorB);

    const r = r1 + (r2 - r1) * t;
    const g = g1 + (g2 - g1) * t;
    const b = b1 + (b2 - b1) * t;
    const a = a1 + (a2 - a1) * t;

    return this._rgba([r, g, b, a]);
  }

  _rgba(rgba) {
    const [r, g, b, a = 255] = rgba;
    return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a / 255})`;
  }

  _colorToRgba(colorString) {
    if (!colorString || typeof colorString !== 'string') {
      return [255, 0, 255, 255];
    }

    colorString = colorString.trim().toLowerCase();

    // Named colors (basic support)
    const namedColors = {
      red: [255, 0, 0, 255],
      green: [0, 255, 0, 255],
      blue: [0, 0, 255, 255],
      yellow: [255, 255, 0, 255],
      cyan: [0, 255, 255, 255],
      magenta: [255, 0, 255, 255],
      black: [0, 0, 0, 255],
      white: [255, 255, 255, 255],
      transparent: [0, 0, 0, 0],
    };
    if (namedColors[colorString]) {
      return namedColors[colorString];
    }

    // Hexadecimal colors
    const hexMatch = colorString.match(/^#?([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
    if (hexMatch) {
      let hex = hexMatch[1];
      let r, g, b, a = 255;

      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else if (hex.length === 6) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
      } else if (hex.length === 8) {
        r = parseInt(hex.substring(0, 2), 16);
        g = parseInt(hex.substring(2, 4), 16);
        b = parseInt(hex.substring(4, 6), 16);
        a = parseInt(hex.substring(6, 8), 16);
      }

      return [r, g, b, a];
    }
    return [255, 0, 255, 255];
  }
}