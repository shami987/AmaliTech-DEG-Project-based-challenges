import './styles.css';
import { getMode, setMode, setSelectedId, getSelectedId } from './store.js';
import { initCanvas, renderAll } from './canvas.js';
import { initEditor, openEditor, closeEditor } from './editor.js';
import { initPreview, startPreview, stopPreview } from './preview.js';

const canvas = document.getElementById('canvas');
const svg = document.getElementById('svg-layer');

function refresh() {
  renderAll(canvas, svg, handleSelect);
  const selId = getSelectedId();
  if (selId) openEditor(selId, refresh);
}

function handleSelect(id) {
  setSelectedId(id);
  refresh();
  openEditor(id, refresh);
}

// Deselect on canvas click
document.getElementById('canvas-wrap').addEventListener('click', () => {
  setSelectedId(null);
  closeEditor();
  refresh();
});

// Play / Stop button
document.getElementById('btn-play').addEventListener('click', () => {
  if (getMode() === 'editor') {
    setMode('preview');
    document.getElementById('btn-play').textContent = '✕ Stop Preview';
    document.getElementById('btn-play').classList.replace('btn-primary', 'btn-danger');
    startPreview();
  } else {
    setMode('editor');
    document.getElementById('btn-play').textContent = '▶ Preview';
    document.getElementById('btn-play').classList.replace('btn-danger', 'btn-primary');
    stopPreview();
    document.getElementById('edit-panel').style.display = '';
    refresh();
  }
});

// Boot
initCanvas(handleSelect);
initEditor(refresh);
initPreview();
