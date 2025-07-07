# Darkest

This is a small browser based combat demo inspired by **Darkest Dungeon**. The
project is built with React and Zustand using ES module imports from a CDN, so
no build step is required.

## Running

Open `index.html` in a modern browser. You can also serve the directory with any
static HTTP server if you prefer.

## Folder structure

- `components/` – React components for the combat scene and UI
- `hooks/` – custom hooks used by the components
- `state/` – Zustand store that manages game data and turns
- `data/` – JSON files describing heroes and enemies
- `styles/` – CSS styling

Several files include `@tweakable` comments to highlight constants that can be
adjusted for balancing or experimentation.
