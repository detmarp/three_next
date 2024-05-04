export default class Program {
  constructor() {
    this.makeOuter();
  }

  makeOuter() {
    this.outer = document.createElement('div');
    this.outer.classList.add('outer');
    document.body.appendChild(this.outer);
  }
  run() {
    const header = document.createElement('h2');
    header.textContent = 'Dixie basic';
    this.outer.appendChild(header);

    const p1 = document.createElement('p');
    p1.textContent = 'OK. This a simple page. With a few goals.  First, for display we want a tall orientation, even on wide screens. Second, we want an optional way of doing vertical overflow. Option A is that the rect expands vertically.  Option B is that the rect does not expand, but it allows for some element within it to have its own internal scroll Bar.';
    this.outer.appendChild(p1);

    const p2 = document.createElement('p');
    p2.textContent = 'Second, I want a few basic controls to look good on desktop, then secondarily on android firefox, then lastly on iPad safari.';
    this.outer.appendChild(p2);
  }
}
