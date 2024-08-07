import Dixie from './dixie/dixie.js';
import DixieTabs from './dixie/dixie-tabs.js';


export default class Program {
  constructor() {
    const outer = Dixie.makeOuter();

    const header = document.createElement('h2');
    header.textContent = 'Dixie folder';
    outer.appendChild(header);

    const p1 = document.createElement('p');
    p1.textContent = 'Hi.';
    outer.appendChild(p1);

    let tabs = new DixieTabs(outer)
    let tab1 = tabs.addTab('Main');
    let tab2 = tabs.addTab('two');
    Dixie.makeFidgetWidget(tab1, 'main');
    Dixie.makeFidgetWidget(tab2, 'two');
  }
}
