const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      position: relative;
    }

    .cart-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 8px;
      background: #f3f4f6;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.2s;
    }

    .cart-button:hover {
      background: #e5e7eb;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 0.375rem;
      border-radius: 9999px;
      background: #2563eb;
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .badge.empty {
      background: #9ca3af;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .badge.bounce {
      animation: bounce 0.3s ease;
    }

    .dropdown {
      display: none;
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      min-width: 300px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
      z-index: 100;
    }

    .dropdown.open {
      display: block;
    }

    .dropdown-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      font-weight: 600;
    }

    .items {
      max-height: 300px;
      overflow-y: auto;
    }

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #f3f4f6;
    }

    .item-info {
      flex: 1;
    }

    .item-name {
      font-weight: 500;
      margin-bottom: 0.25rem;
    }

    .item-price {
      font-size: 0.875rem;
      color: #6b7280;
    }

    .item-quantity {
      margin-left: 1rem;
      font-size: 0.875rem;
      color: #6b7280;
    }

    .remove-btn {
      margin-left: 0.5rem;
      padding: 0.25rem;
      border: none;
      background: none;
      color: #ef4444;
      cursor: pointer;
      font-size: 1rem;
    }

    .dropdown-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
    }

    .total {
      display: flex;
      justify-content: space-between;
      font-weight: 600;
      margin-bottom: 1rem;
    }

    .checkout-btn {
      width: 100%;
      padding: 0.75rem;
      border: none;
      border-radius: 8px;
      background: #2563eb;
      color: white;
      font-weight: 500;
      cursor: pointer;
    }

    .checkout-btn:hover {
      background: #1d4ed8;
    }

    .empty-message {
      padding: 2rem;
      text-align: center;
      color: #6b7280;
    }
  </style>
  <button class="cart-button">
    <span>Warenkorb</span>
    <span class="badge empty">0</span>
  </button>
  <div class="dropdown">
    <div class="dropdown-header">Warenkorb</div>
    <div class="items"></div>
    <div class="dropdown-footer">
      <div class="total">
        <span>Gesamt:</span>
        <span class="total-price">0.00 EUR</span>
      </div>
      <button class="checkout-btn">Zur Kasse</button>
    </div>
  </div>
`;

class ShoppingCart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.items = [];
  }

  connectedCallback() {
    this.setupEventListeners();
    this.render();
  }

  get totalItems() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  get totalPrice() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  addItem(item) {
    const existing = this.items.find(i => i.productId === item.productId);

    if (existing) {
      existing.quantity++;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }

    this.render();
    this.animateBadge();
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.productId !== productId);
    this.render();
  }

  animateBadge() {
    const badge = this.shadowRoot.querySelector('.badge');
    badge.classList.add('bounce');
    setTimeout(() => badge.classList.remove('bounce'), 300);
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector('.cart-button');
    const dropdown = this.shadowRoot.querySelector('.dropdown');

    button.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!this.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  }

  render() {
    const badge = this.shadowRoot.querySelector('.badge');
    const itemsContainer = this.shadowRoot.querySelector('.items');
    const totalPriceEl = this.shadowRoot.querySelector('.total-price');
    const footer = this.shadowRoot.querySelector('.dropdown-footer');

    badge.textContent = this.totalItems;
    badge.classList.toggle('empty', this.totalItems === 0);

    if (this.items.length === 0) {
      itemsContainer.innerHTML = '<div class="empty-message">Ihr Warenkorb ist leer</div>';
      footer.style.display = 'none';
    } else {
      footer.style.display = 'block';
      itemsContainer.innerHTML = this.items.map(item => `
        <div class="item">
          <div class="item-info">
            <div class="item-name">${this.escapeHtml(item.name)}</div>
            <div class="item-price">${item.price.toFixed(2)} EUR</div>
          </div>
          <span class="item-quantity">x${item.quantity}</span>
          <button class="remove-btn" data-id="${item.productId}">x</button>
        </div>
      `).join('');

      itemsContainer.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          this.removeItem(btn.dataset.id);
        });
      });
    }

    totalPriceEl.textContent = this.totalPrice.toFixed(2) + ' EUR';
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

customElements.define('shopping-cart', ShoppingCart);
