const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      margin-bottom: 1.5rem;
    }

    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .filter-btn {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 9999px;
      background: white;
      color: #374151;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .filter-btn:hover {
      border-color: #2563eb;
      color: #2563eb;
    }

    .filter-btn.active {
      background: #2563eb;
      border-color: #2563eb;
      color: white;
    }
  </style>
  <div class="filter-bar"></div>
`;

class FilterBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['categories'];
  }

  get categories() {
    try {
      return JSON.parse(this.getAttribute('categories') || '[]');
    } catch {
      return [];
    }
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  render() {
    const container = this.shadowRoot.querySelector('.filter-bar');
    const categories = [{ id: 'all', name: 'Alle' }, ...this.categories];

    container.innerHTML = categories.map((cat, index) => `
      <button class="filter-btn${index === 0 ? ' active' : ''}" data-category="${cat.id}">
        ${this.escapeHtml(cat.name)}
      </button>
    `).join('');

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.shadowRoot.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.shadowRoot.querySelectorAll('.filter-btn').forEach(b =>
          b.classList.remove('active')
        );
        btn.classList.add('active');

        this.dispatchEvent(new CustomEvent('filter-change', {
          bubbles: true,
          composed: true,
          detail: { category: btn.dataset.category }
        }));
      });
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define('filter-bar', FilterBar);
