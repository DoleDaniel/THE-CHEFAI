export class Router {
  constructor(routes) {
    this.routes = routes;
    this.root = document.getElementById('app-root');
    this.currentView = null;
  }

  navigate(path) {
    if (this.currentView) {
      this.currentView.unmount();
    }
    
    const component = this.routes[path];
    if (component) {
      this.currentView = new component(this.root);
      this.currentView.mount();
      
      // Update nav active states
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.target === path) {
          link.classList.add('active');
        }
      });
    }
  }
}
