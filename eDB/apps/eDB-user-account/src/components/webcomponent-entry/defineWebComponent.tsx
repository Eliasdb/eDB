import { QueryClientProvider } from '@tanstack/react-query';
import ReactDOM from 'react-dom/client';
import App from '../../app/app';
import { queryClient } from '../../utils/react-query';

export function defineReactWebComponent() {
  class ReactWebComponent extends HTMLElement {
    private root?: ReactDOM.Root;

    async connectedCallback() {
      const shadowRoot = this.attachShadow({ mode: 'open' });

      // ✅ Inject styles built separately by Vite
      const cssText = await fetch(
        '/assets/eDB-user-account/app-styles.css',
      ).then((res) => res.text());

      const styleTag = document.createElement('style');
      styleTag.textContent = cssText;
      shadowRoot.appendChild(styleTag);

      const container = document.createElement('div');
      shadowRoot.appendChild(container);

      this.root = ReactDOM.createRoot(container);
      this.root.render(
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>,
      );
    }

    disconnectedCallback() {
      this.root?.unmount();
    }
  }

  if (!customElements.get('home-react')) {
    customElements.define('home-react', ReactWebComponent);
  }
}

defineReactWebComponent();
