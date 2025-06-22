export default class ScreenHome2 {
  static firstFrame = true;

  constructor(program) {
    this.program = program;
    this.parent = program.overlay;
    this.helly = this.program.iris.helly;

    this.colors = {
      gradientBottom: 'rgba(255, 182, 193, 0.8)',
      gradientTop: 'rgba(173, 216, 230, 0.8)',
      buttonText: 'white',
      buttonBackground: '#ff5722',
      buttonHoverShadow: 'rgba(0, 0, 0, 0.3)',
      buttonShadow: 'rgba(0, 0, 0, 0.2)',
      buttonHoverScale: 1.1,
      hruleColor: '#862',
    };

    this._setup();
  }

  _hRule(parent) {
    const hr = document.createElement('hr');
    hr.style.border = 'none';
    hr.style.borderTop = `1px solid ${this.colors.hruleColor}`;
    hr.style.width = '80%';
    hr.style.margin = '20px auto';
    hr.style.opacity = '0.7';
    parent.appendChild(hr);
  }

  _setup() {
    this.parent.innerHTML = '';

    // Set the parent container to use flexbox
    this.parent.style.display = 'flex';
    this.parent.style.flexDirection = 'column';
    this.parent.style.height = '100vh'; // Full height of the viewport

    // Create a container for the header
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    this.parent.appendChild(headerContainer);

    // Add the header content to the container
    this._addHeader(headerContainer);

    // Create a vertical scroll area that fills the remaining space
    this.scrollArea = document.createElement('div');
    this.scrollArea.id = 'scrollarea';
    this.scrollArea.style.flexGrow = '1'; // Allow it to grow and fill the remaining space
    this.scrollArea.style.overflowY = 'scroll'; // Enable vertical scrolling
    this.scrollArea.style.backgroundColor = 'transparent'; // Transparent background

    // Hide the scroll bar while keeping scrolling functional
    this.scrollArea.style.scrollbarWidth = 'none'; // For Firefox
    this.scrollArea.style.msOverflowStyle = 'none'; // For IE and Edge
    this.scrollArea.style.overflowX = 'hidden'; // Prevent horizontal scrolling
    this.scrollArea.style.webkitOverflowScrolling = 'touch'; // Smooth scrolling on mobile

    // Hide scroll bar for WebKit browsers (Chrome, Safari)
    this.scrollArea.style.cssText += '::-webkit-scrollbar { display: none; }';

    this.parent.appendChild(this.scrollArea);

    // Refresh the scroll area content
    this._refreshScroll();
  }

  _addHeader(container) {
    const hamburgerButton = document.createElement('button');
    hamburgerButton.textContent = '☰';
    hamburgerButton.style.fontSize = '24px';
    hamburgerButton.style.position = 'absolute';
    hamburgerButton.style.top = '10px';
    hamburgerButton.style.right = '10px';
    hamburgerButton.style.padding = '10px';
    hamburgerButton.style.cursor = 'pointer';

    hamburgerButton.addEventListener('click', () => {
      this._exitTo('settings');
    });

    container.appendChild(hamburgerButton);

    const titleText = document.createElement('div');
    titleText.textContent = 'TinyTowns';
    titleText.style.fontSize = '48px';
    titleText.style.fontWeight = 'bold';
    titleText.style.textAlign = 'center';
    titleText.style.margin = '20px 0';
    container.appendChild(titleText);

    this._hRule(container);

    this._myButton(container, 'New game', () => {
      this._exitTo('newgame');
    });

    this._myButton(container, 'Quick start', () => {
      this._exitTo('quickstart');
    });

    this._hRule(container);
  }

  _myButton(parent, label, callback) {
    const button = document.createElement('button');
    button.textContent = label;

    button.style.display = 'block';
    button.style.margin = '20px auto';
    button.style.padding = '15px 30px';
    button.style.fontSize = '20px';
    button.style.fontWeight = 'bold';
    button.style.color = this.colors.buttonText;
    button.style.backgroundColor = this.colors.buttonBackground;
    button.style.border = 'none';
    button.style.borderRadius = '25px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = `0 4px 8px ${this.colors.buttonShadow}`;
    button.style.transition = 'transform 0.2s, box-shadow 0.2s';

    // Add hover effect
    button.addEventListener('mouseenter', () => {
      button.style.transform = `scale(${this.colors.buttonHoverScale})`;
      button.style.boxShadow = `0 6px 12px ${this.colors.buttonHoverShadow}`;
    });

    button.addEventListener('mouseleave', () => {
      button.style.transform = 'scale(1)';
      button.style.boxShadow = `0 4px 8px ${this.colors.buttonShadow}`;
    });

    // Add click event
    button.addEventListener('click', callback);

    // Append the button to the scroll area
    parent.appendChild(button);
  }

  _refreshScroll() {
    this.scrollArea.innerHTML = '';

    for (let i = 0; i < 50; i++) {
      const textLine = document.createElement('div');
      textLine.textContent = `This is line ${i + 1}`;
      textLine.style.margin = '10px';
      this.scrollArea.appendChild(textLine);
    }

    this.program.makeOverlayInputFriendly(this.parent);
  }

  render(time, dt) {
    if (ScreenHome2.firstFrame) {
      ScreenHome2.firstFrame = false;
      if (this.program.iris.settings.data.autocontinue && this.program.iris.settings.data.current) {
        this._exitTo('game', this.program.iris.settings.data.current);
      }
    }

    const context = this.program.canvas.getContext('2d');
    const gradient = context.createLinearGradient(0, 0, 0, this.program.canvas.height);
    gradient.addColorStop(0, this.colors.gradientTop);
    gradient.addColorStop(1, this.colors.gradientBottom);
    context.fillStyle = gradient;
    context.fillRect(0, 0, this.program.canvas.width, this.program.canvas.height);
  }

  _exitTo(mode, data = null) {
    this.program.goto(mode, data);
  }
}
