export class FeedTab {
  constructor(root) {
    this.root = root;
    this.container = document.createElement('section');
    this.container.className = 'app-view active';
    this.container.id = 'feed-view';
    this.container.innerHTML = `
      <div class="view-header">
        <h1 class="view-title">Stimulate Your Appetite</h1>
        <p class="view-subtitle">Browse mouth-watering, human-prepared delicacies from around the globe. Tap any dish for exact procedures, ingredients, and video guides.</p>
      </div>
      
      <!-- Search Bar -->
      <div class="search-bar-container" style="margin-bottom: 30px; display: flex; gap: 12px; max-width: 600px;">
        <div style="position: relative; flex: 1;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--text-muted); font-size: 0.95rem;"></i>
          <input type="text" id="feed-search-input" placeholder="Search cuisines, ingredients, or cultures (e.g., Jollof, Tacos, Brazilian, beans)..." style="width: 100%; padding: 12px 14px 12px 42px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--border-color); border-radius: 8px; color: var(--text-main); font-family: var(--font-body); font-size: 0.95rem; transition: var(--transition-smooth);" autocomplete="off">
        </div>
      </div>
      
      <!-- Feed Grid -->
      <div class="feed-grid" id="recipes-feed-grid">
        <!-- Populated by JavaScript -->
      </div>
    `;
    
    // Append immediately so global app.js logic can query its IDs (like recipes-feed-grid)
    this.root.appendChild(this.container);
  }

  mount() {
    this.container.style.display = 'block';
  }

  unmount() {
    this.container.style.display = 'none';
  }
}
