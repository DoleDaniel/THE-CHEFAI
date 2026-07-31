export class MealTab {
  constructor(root) {
    this.root = root;
    this.container = document.createElement('div');
    this.container.className = 'app-view';
    this.container.id = 'meal-view';
  }

  mount() {
    const existing = document.getElementById('meal-view');
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
