export class FeedTab {
  constructor(root) {
    this.root = root;
    this.container = document.createElement('div');
    this.container.className = 'app-view active';
    this.container.id = 'feed-view';
  }

  mount() {
    // In a full refactor, the HTML template would be injected here.
    // To prevent breaking the monolithic app.js which relies on global DOM access,
    // we simply manage visibility of the existing DOM node for now, 
    // or inject a template if fully decoupled.
    
    const existing = document.getElementById('feed-view');
    if (existing) {
      existing.style.display = 'block';
      this.container = existing;
    } else {
      this.root.appendChild(this.container);
    }
  }

  unmount() {
    if (this.container) {
      this.container.style.display = 'none';
    }
  }
}
