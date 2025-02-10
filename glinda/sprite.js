export default class Sprite {
  constructor(image, source, size, anchor) {
    this.image = image;
    this.source = source; // [x, y]
    this.size = size; // [width, height]
    this.anchor = anchor; // [x, y]
  }

  draw(context, position) {
    //this.source = [Math.random() * 2048, Math.random() * 2048];
    //this.size = [Math.random() * 2048, Math.random() * 2048];
    //position = [Math.random() * 20, Math.random() * 20];
    context.drawImage(
      this.image,
      this.source[0],
      this.source[1],
      this.size[0],
      this.size[1],
      position[0] - this.anchor[0],
      position[1] - this.anchor[1],
      this.size[0],
      this.size[1]
    );
  }
}
