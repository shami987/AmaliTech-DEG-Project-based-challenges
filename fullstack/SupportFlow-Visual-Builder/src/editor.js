import { getNodeById, updateNodeText } from './store.js';

export function initEditor(onUpdate) {
  const panel = document.getElementById('edit-panel');

  panel.innerHTML = `
    <h2>Edit Node</h2>
    <div class="field">
      <label>Question Text</label>
      <textarea id="ep-text" rows="4"></textarea>
    </div>
    <div class="divider"></div>
    <div class="field">
      <label>Options</label>
      <div id="ep-options" class="options-list"></div>
    </div>
    <button class="btn btn-ghost" id="ep-close">Close</button>
  `;

  document.getElementById('ep-close').addEventListener('click', () => closeEditor());

  document.getElementById('ep-text').addEventListener('input', (e) => {
    const id = panel.dataset.nodeId;
    if (!id) return;
    updateNodeText(id, e.target.value);
    onUpdate();
  });
}

export function openEditor(id, onUpdate) {
  const panel = document.getElementById('edit-panel');
  const node = getNodeById(id);
  if (!node) return;

  panel.dataset.nodeId = id;
  panel.classList.add('open');

  document.getElementById('ep-text').value = node.text;

  const optsList = document.getElementById('ep-options');
  optsList.innerHTML = node.options.length
    ? node.options.map((o, i) => `
        <div class="option-row">
          <input type="text" data-index="${i}" value="${o.label}" placeholder="Option label"/>
        </div>`).join('')
    : '<span style="font-size:0.8rem;color:var(--text-muted)">No options (leaf node)</span>';

  optsList.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const node = getNodeById(panel.dataset.nodeId);
      node.options[+e.target.dataset.index].label = e.target.value;
      onUpdate();
    });
  });
}

export function closeEditor() {
  const panel = document.getElementById('edit-panel');
  panel.classList.remove('open');
  panel.dataset.nodeId = '';
}
