export class Router {
  constructor(routes) {
    this.routes = routes;
    this.instances = {};
    this.root = document.getElementById('app-root') || document.body;
    this.currentView = null;
  }

  navigate(path) {
    if (this.currentView) {
      this.currentView.unmount();
    }
    
    const ComponentClass = this.routes[path];
    if (ComponentClass) {
      if (!this.instances[path]) {
        this.instances[path] = new ComponentClass(this.root);
      }
      this.currentView = this.instances[path];
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
