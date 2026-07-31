export class ProfileTab {
  constructor(root) {
    this.root = root;
    this.container = document.createElement('div');
    this.container.className = 'app-view';
    this.container.id = 'profile-view';
  }

  mount() {
    const existing = document.getElementById('profile-view');
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
