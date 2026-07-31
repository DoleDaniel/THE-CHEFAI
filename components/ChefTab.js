export class ChefTab {
  constructor(root) {
    this.root = root;
    this.container = document.createElement('div');
    this.container.className = 'app-view';
    this.container.id = 'chef-view';
  }

  mount() {
    const existing = document.getElementById('chef-view');
    if (existing) {
      existing.style.display = 'block';
      this.container = existing;
    }
  }

  unmount() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
}
