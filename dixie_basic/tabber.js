
export default class Tabber {
  constructor(parentElement, onSelected = null) {
    this.parentElement = parentElement;
    this.tabsContainer = document.createElement('div');
    this.tabsContainer.className = 'tabber-tabs-container';
    this.parentElement.appendChild(this.tabsContainer);

    this.tabContentsContainer = document.createElement('div');
    this.tabContentsContainer.className = 'tabber-contents-container';
    this.parentElement.appendChild(this.tabContentsContainer);

    this.tabs = [];
    this.onSelected = onSelected;
    this.index = 0;

    this.tabsContainer.addEventListener('click', this.handleTabClick.bind(this));
  }

  addTab(name, onSelectedCallback = null) {
    const tab = document.createElement('div');
    tab.className = 'tabber-tab tabber-deselected'; // Initial class for deselected tab
    tab.textContent = name;
    this.tabsContainer.appendChild(tab);

    const tabContent = document.createElement('div');
    tabContent.className = 'tabber-content';
    this.tabContentsContainer.appendChild(tabContent);

    this.tabs.push({ tab, tabContent });

    // Hide all tab contents except the first one
    this.tabs.forEach((entry, index) => {
      entry.tabContent.style.display = index === 0 ? 'block' : 'none';
    });

    // Select the first tab by default (index 0) only if it's the first tab added
    if (this.tabs.length === 1) {
      this.selectTab(0);
    }

    if (onSelectedCallback) {
      const lastIndex = this.tabs.length - 1;
      this.tabs[lastIndex].tab.addEventListener('click', () => {
        this.clearTabContent(tabContent); // Clear tab content before calling callback
        onSelectedCallback(tabContent);
      });

      onSelectedCallback(tabContent);
    }

    return tabContent;
  }

  addTabWithCallback(name, onSelectedCallback = null) {
    const tabContent = this.addTab(name);

    if (onSelectedCallback) {
      const lastIndex = this.tabs.length - 1;
      this.tabs[lastIndex].tab.addEventListener('click', () => {
        this.clearTabContent(tabContent); // Clear tab content before calling callback
        onSelectedCallback(tabContent);
      });
    }

    return tabContent;
  }

  clearTabContent(tabContent) {
    while (tabContent.firstChild) {
      tabContent.removeChild(tabContent.firstChild);
    }
  }

  handleTabClick(event) {
    const clickedTab = event.target;
    const tabIndex = this.tabs.findIndex(entry => entry.tab === clickedTab);

    if (tabIndex !== -1) {
      this.selectTab(tabIndex);
    }
  }

  selectTab(index) {
    this.tabs.forEach((entry, tabIndex) => {
      const isSelected = tabIndex === index;

      entry.tabContent.style.display = isSelected ? 'block' : 'none';

      entry.tab.classList.toggle('tabber-selected', isSelected);
      entry.tab.classList.toggle('tabber-deselected', !isSelected);
    });

    this.index = index;

    if (this.onSelected) {
      this.onSelected(index);
    }
  }
}
