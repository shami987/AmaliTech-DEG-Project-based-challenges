# SupportFlow Visual Builder

A visual decision tree editor for building and testing automated customer support conversation flows. Built with Vanilla JS and SVG — no graph libraries, no component frameworks.

---

## Live Demo

> [Add your deployment link here]

## Design File

> [Add your Figma/Penpot link here]

---

## Features

### Visual Flow Canvas
- Nodes are rendered absolutely on a dot-grid canvas using x/y coordinates from `flow_data.json`
- Curved SVG bezier curves connect parent nodes to their children based on flow logic
- Nodes are **draggable** — connectors update in real-time as you reposition them
- Color-coded node types: `start` (blue), `question` (purple), `end` (teal)

### Node Editor
- Click any node to open the edit panel
- Edit question text — canvas updates instantly (in-memory state, no database needed)
- Edit option labels inline
- Remove individual options with the ✕ button

### Preview / Runner Mode
- Hit **▶ Preview** to switch from the flowchart editor to a live chat interface
- The bot presents the start node's question with clickable answer buttons
- Selecting an answer traverses the graph and shows the next node
- A **Restart** button appears at leaf nodes (end of conversation)
- Hit **✕ Stop Preview** to return to the editor

### Wildcard Feature — Add & Delete Nodes
The biggest pain point for a support manager is being locked into a fixed tree. The **Add Child Node** feature lets you grow the conversation flow directly from the editor panel without touching any JSON:

- Type an option label in the "Add Child Node" input and click **+ Add**
- A new node is created on the canvas, connected to the current node, and immediately selected for editing
- The **Delete** button removes any non-start node and automatically cleans up all connections pointing to it

This makes the tool self-sufficient — managers can build and modify entire conversation trees without engineering help, which is the core business value of the product.

---

## Tech Stack

| Concern | Choice |
|---|---|
| Language | Vanilla JavaScript (ES Modules) |
| Styling | Custom CSS (no Bootstrap / MUI) |
| Graph rendering | Hand-written SVG bezier curves |
| Build / Dev server | Vite |
| Fonts | Inter (Google Fonts) |

---

## Project Structure

```
├── src/
│   ├── main.js       # App entry point, wires all modules together
│   ├── store.js      # In-memory state (nodes, mode, selection)
│   ├── canvas.js     # Node rendering, SVG connectors, drag logic
│   ├── editor.js     # Edit panel — text, options, add/delete nodes
│   ├── preview.js    # Chat runner mode
│   └── styles.css    # Full design system (tokens, layout, components)
├── flow_data.json    # Source conversation tree data
└── index.html        # App shell
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

Open `http://localhost:5173` in your browser.

---

## Design Decisions

**No graph libraries** — Node positions and SVG connector paths are computed directly from DOM coordinates. Each connector is a cubic bezier curve (`M x1 y1 C cx cy, cx cy, x2 y2`) calculated from the node's center-bottom to the child's center-top.

**No component frameworks** — The UI is built with plain ES module functions. Each module owns one concern (store, canvas, editor, preview) and communicates through a shared `refresh()` callback, keeping the architecture simple and auditable.

**Dark design system** — CSS custom properties define all colors, spacing, and shadows in one place (`styles.css`), making the visual language consistent and easy to update.
