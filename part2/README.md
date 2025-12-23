# Part 2: Atlas Components in Astro

Headless UI mit Vanilla JavaScript - wie eine moderne Component Library Web Components ersetzt.

## Installation

```bash
npm install
npm run dev
```

## Enthaltene Komponenten

### Modal
- Backdrop mit Blur-Effekt
- Escape-Taste zum Schliessen
- Backdrop-Klick zum Schliessen
- Focus-Management

### Tabs
- Keyboard-Navigation (in Erweiterung moeglich)
- ARIA-Attribute fuer Accessibility
- Active State Management

### Accordion
- Single oder Multiple Open Mode
- ARIA-Attribute
- Animierte Icons

## Konzept: Headless Components

Headless Components bieten Verhalten ohne Styling:

| Aspekt | Web Components | Headless Components |
|--------|----------------|---------------------|
| HTML | Custom Elements | Standard-HTML |
| Styling | Shadow DOM | Entwickler kontrolliert CSS |
| Verhalten | In Komponente gekapselt | JS bindet an HTML |
| SSR | Problematisch | SSR-safe by design |

## Projektstruktur

```
src/
  components/
    Modal.astro
    Tabs.astro
    Accordion.astro
  pages/
    index.astro
public/
  styles/
    global.css
```

## Artikel

[Atlas Components in Astro: Headless UI](https://casoon.de/artikel/web-components-atlas-astro/)
