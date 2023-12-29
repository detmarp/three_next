import Doc from './d/doc.js';

export default class Program {
  constructor(root) {
    this.root = root;
  }

  setup() {
    this.doc = new Doc(this.root);

    this.doc.add('h1', 'Some html things');
    this.doc.add('text', 'A little program');
    this.doc.add('h2', 'Another part');

    let self = this;

    let buttonA = this.doc.add('button', 'Button A');
    this.doc.onClick(buttonA, () => {
      self.click('You clicked button A');
    });

    this.doc.add('br');

    let buttonB = this.doc.add('button', 'Button B');
    this.doc.onClick(buttonB, () => {
      self.click('Button B says Hi');
    });

    this.doc.add('hr');
    this.messageArea = this.doc.add('div');
    this.doc.add('hr');

    this.doc.add('text', 'the end');

    this.click('(messages go here)');
  }

  click(message) {
    this.doc.clear(this.messageArea);
    this.doc.add('text', message, this.messageArea);
  }

  run() {
    this.setup();
  }
}
