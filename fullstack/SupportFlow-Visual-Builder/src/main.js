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

document.getElementById('canvas-wrap').addEventListener('click', () => {
  setSelectedId(null);
  closeEditor();
  refresh();
});

document.getElementById('btn-play').addEventListener('click', () => {
  const btn = document.getElementById('btn-play');
  if (getMode() === 'editor') {
    setMode('preview');
    btn.textContent = '✕ Stop Preview';
    btn.classList.replace('btn-primary', 'btn-danger');
    startPreview();
  } else {
    setMode('editor');
    btn.textContent = '▶ Preview';
    btn.classList.replace('btn-danger', 'btn-primary');
    stopPreview();
    refresh();
  }
});

initCanvas(handleSelect);
initEditor(refresh);
initPreview();
