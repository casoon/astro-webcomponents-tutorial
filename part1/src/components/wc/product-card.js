const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      contain: layout style;
    }

    .product-card {
      background: var(--card-bg, white);
      border-radius: var(--card-radius, 12px);
      box-shadow: var(--card-shadow, 0 2px 8px rgba(0, 0, 0, 0.1));
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .product-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
    }

    .product-image {
      width: 100%;
      height: 200px;
      object-fit: cover;
      background: #f3f4f6;
    }

    .product-content {
      padding: 1rem;
    }

    h3 {
      margin: 0 0 0.5rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .price {
      margin: 0 0 1rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--price-color, #2563eb);
    }

    .add-to-cart {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      background: var(--button-bg, #2563eb);
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }

    .add-to-cart:hover {
      background: #1d4ed8;
    }

    .add-to-cart.added {
      background: #16a34a;
    }
  </style>
  <article class="product-card">
    <img class="product-image" alt="" />
    <div class="product-content">
      <h3 class="name"></h3>
      <p class="price"></p>
      <button class="add-to-cart">In den Warenkorb</button>
    </div>
  </article>
`;

class ProductCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ['name', 'price', 'image', 'product-id'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue && this.isConnected) {
      this.render();
    }
  }

  render() {
    const name = this.getAttribute('name') || 'Produkt';
    const price = this.getAttribute('price') || '0.00';
    const image = this.getAttribute('image') || '/images/placeholder.jpg';

    this.shadowRoot.querySelector('.name').textContent = name;
    this.shadowRoot.querySelector('.price').textContent = price + ' EUR';
    this.shadowRoot.querySelector('.product-image').src = image;
    this.shadowRoot.querySelector('.product-image').alt = name;
  }

  setupEventListeners() {
    const button = this.shadowRoot.querySelector('.add-to-cart');

    button.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('add-to-cart', {
        bubbles: true,
        composed: true,
        detail: {
          productId: this.getAttribute('product-id'),
          name: this.getAttribute('name'),
          price: parseFloat(this.getAttribute('price'))
        }
      }));

      button.textContent = 'Hinzugefuegt';
      button.classList.add('added');

      setTimeout(() => {
        button.textContent = 'In den Warenkorb';
        button.classList.remove('added');
      }, 1500);
    });
  }
}

customElements.define('product-card', ProductCard);
