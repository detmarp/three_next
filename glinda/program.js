export default class Program {
  constructor(container) {
    this.container = container;
    this.canvas = null;
    this.context = null;
    this.colorToggle = false;
  }

  run() {
    // Clear the existing content
    this.container.innerHTML = '';

    // Create a full-window canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.container.appendChild(this.canvas);

    // Initialize the canvas context for drawing
    this.context = this.canvas.getContext('2d');

    // Add resize event listener
    window.addEventListener('resize', () => this.onResize());
    this.onResize(); // Initial resize to set canvas size

    // Start the animation loop
    this.animate();
  }

  onResize() {
    // Adjust canvas size
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  animate() {
    // Determine the color based on the evenness of width and height
    let color;
    if (this.canvas.width % 2 === 0 && this.canvas.height % 2 === 0) {
      color = 'green';
    } else if (this.canvas.width % 2 === 0 && this.canvas.height % 2 !== 0) {
      color = 'cyan';
    } else if (this.canvas.width % 2 !== 0 && this.canvas.height % 2 === 0) {
      color = 'blue';
    } else {
      color = 'purple';
    }

    // Clear the canvas with alternating colors
    this.context.fillStyle = this.colorToggle ? color : 'yellow';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.colorToggle = !this.colorToggle;

    // Request the next frame
    requestAnimationFrame(() => this.animate());
  }
}