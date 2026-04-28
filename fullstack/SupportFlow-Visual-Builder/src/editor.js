import { getNodeById, updateNodeText, addNode, deleteNode, setSelectedId } from './store.js';

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
    <div class="divider"></div>
    <div class="field">
      <label>Add Child Node</label>
      <div style="display:flex;gap:6px;">
        <input id="ep-new-label" type="text" placeholder="Option label" />
        <button class="btn btn-ghost" id="ep-add-node">+ Add</button>
      </div>
    </div>
    <div style="margin-top:auto;padding-top:12px;display:flex;gap:8px;">
      <button class="btn btn-ghost" id="ep-close" style="flex:1">Close</button>
      <button class="btn btn-danger" id="ep-delete">Delete</button>
    </div>
  `;

  document.getElementById('ep-close').addEventListener('click', closeEditor);

  document.getElementById('ep-text').addEventListener('input', (e) => {
    const id = panel.dataset.nodeId;
    if (!id) return;
    updateNodeText(id, e.target.value);
    onUpdate();
  });

  document.getElementById('ep-add-node').addEventListener('click', () => {
    const id = panel.dataset.nodeId;
    if (!id) return;
    const label = document.getElementById('ep-new-label').value.trim() || 'New Option';
    const newId = addNode(id, label);
    document.getElementById('ep-new-label').value = '';
    setSelectedId(newId);
    onUpdate();
    openEditor(newId, onUpdate);
  });

  document.getElementById('ep-delete').addEventListener('click', () => {
    const id = panel.dataset.nodeId;
    const node = getNodeById(id);
    if (!node || node.type === 'start') return;
    deleteNode(id);
    closeEditor();
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

  // Show/hide delete for start node
  const delBtn = document.getElementById('ep-delete');
  delBtn.style.display = node.type === 'start' ? 'none' : '';

  const optsList = document.getElementById('ep-options');
  renderOptions(optsList, node, onUpdate, panel);
}

function renderOptions(optsList, node, onUpdate, panel) {
  optsList.innerHTML = node.options.length
    ? node.options.map((o, i) => `
        <div class="option-row">
          <input type="text" data-index="${i}" value="${o.label}" placeholder="Option label"/>
          <button class="btn btn-danger" data-del="${i}" style="padding:6px 8px;">✕</button>
        </div>`).join('')
    : '<span style="font-size:0.8rem;color:var(--text-muted)">No options (leaf node)</span>';

  optsList.querySelectorAll('input[data-index]').forEach(inp => {
    inp.addEventListener('input', (e) => {
      const n = getNodeById(panel.dataset.nodeId);
      n.options[+e.target.dataset.index].label = e.target.value;
      onUpdate();
    });
  });

  optsList.querySelectorAll('button[data-del]').forEach(btn => {
    btn.addEventListener('click', () => {
      const n = getNodeById(panel.dataset.nodeId);
      n.options.splice(+btn.dataset.del, 1);
      onUpdate();
      openEditor(panel.dataset.nodeId, onUpdate);
    });
  });
}

export function closeEditor() {
  const panel = document.getElementById('edit-panel');
  panel.classList.remove('open');
  panel.dataset.nodeId = '';
}
