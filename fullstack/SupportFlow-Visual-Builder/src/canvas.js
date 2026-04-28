import { getNodes, getSelectedId, setSelectedId, updateNodePosition } from './store.js';

const NODE_W = 220;
const NODE_H = 90;

export function initCanvas(onSelect) {
  const canvas = document.getElementById('canvas');
  const svg = document.getElementById('svg-layer');

  // SVG arrowhead marker
  svg.innerHTML = `
    <defs>
      <marker id="arrowhead" markerWidth="8" markerHeight="6"
        refX="8" refY="3" orient="auto">
        <polygon points="0 0, 8 3, 0 6" fill="#2e3250"/>
      </marker>
    </defs>`;

  renderAll(canvas, svg, onSelect);
}

export function renderAll(canvas, svg, onSelect) {
  // Remove existing nodes (keep svg)
  canvas.querySelectorAll('.node').forEach(n => n.remove());

  const nodes = getNodes();
  const selectedId = getSelectedId();

  nodes.forEach(node => {
    const el = createNodeEl(node, selectedId === node.id);
    makeDraggable(el, node, canvas, svg);
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      onSelect(node.id);
    });
    canvas.appendChild(el);
  });

  drawConnectors(svg, nodes);
}

function createNodeEl(node, selected) {
  const el = document.createElement('div');
  el.className = `node${selected ? ' selected' : ''}`;
  el.dataset.id = node.id;
  el.style.left = node.position.x + 'px';
  el.style.top = node.position.y + 'px';

  const badgeClass = `badge-${node.type}`;
  const optionPills = node.options.map(o =>
    `<div class="node-option-pill">↳ ${o.label}</div>`
  ).join('');

  el.innerHTML = `
    <span class="node-badge ${badgeClass}">${node.type}</span>
    <div class="node-text">${node.text}</div>
    ${node.options.length ? `<div class="node-options">${optionPills}</div>` : ''}
  `;
  return el;
}

function drawConnectors(svg, nodes) {
  // Remove old paths (keep defs)
  svg.querySelectorAll('path').forEach(p => p.remove());

  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  nodes.forEach(parent => {
    parent.options.forEach(opt => {
      const child = nodeMap[opt.nextId];
      if (!child) return;

      const x1 = parent.position.x + NODE_W / 2;
      const y1 = parent.position.y + NODE_H;
      const x2 = child.position.x + NODE_W / 2;
      const y2 = child.position.y;

      const cy = (y1 + y2) / 2;
      const d = `M ${x1} ${y1} C ${x1} ${cy}, ${x2} ${cy}, ${x2} ${y2}`;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('class', 'connector');
      svg.appendChild(path);
    });
  });
}

function makeDraggable(el, node, canvas, svg) {
  let startX, startY, origX, origY;

  el.addEventListener('mousedown', (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    origX = node.position.x;
    origY = node.position.y;
    el.classList.add('dragging');

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      const newX = Math.max(0, origX + dx);
      const newY = Math.max(0, origY + dy);
      el.style.left = newX + 'px';
      el.style.top = newY + 'px';
      updateNodePosition(node.id, newX, newY);
      drawConnectors(svg, getNodes());
    };

    const onUp = () => {
      el.classList.remove('dragging');
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}
