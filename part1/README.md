# Part 1: Vanilla Web Components in Astro

Praktischer Einstieg in Web Components mit Astro. Vom ersten Custom Element bis zur produktionsreifen Komponente.

## Installation

```bash
npm install
npm run dev
```

## Enthaltene Komponenten

### ProductCard
- Shadow DOM mit Style-Kapselung
- Custom Events (add-to-cart)
- XSS-Schutz
- Template-Caching

### ShoppingCart
- State-Management mit Klassen-Properties
- Dropdown mit Click-Outside-Handling
- Badge-Animation
- Public API (addItem, removeItem)

### FilterBar
- JSON-Attribute parsen
- Event-basierte Kommunikation
- Active State Management

## Projektstruktur

```
src/
  components/
    wc/              # Web Components (Vanilla JS)
      product-card.js
      shopping-cart.js
      filter-bar.js
    ui/              # Astro-Komponenten
      Layout.astro
  data/
    products.json
  pages/
    index.astro
  styles/
    global.css
```

## Artikel

[Web Components in Astro: Praktischer Einstieg](https://casoon.de/artikel/web-components-astro-praxis-beispiel-repo/)
