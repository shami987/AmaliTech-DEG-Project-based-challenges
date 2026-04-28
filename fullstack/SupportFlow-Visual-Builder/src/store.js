import flowData from '../flow_data.json';

const state = {
  nodes: flowData.nodes.map(n => ({ ...n, options: n.options.map(o => ({ ...o })), position: { ...n.position } })),
  mode: 'editor',
  selectedId: null,
};

export const getNodes = () => state.nodes;
export const getMode = () => state.mode;
export const getSelectedId = () => state.selectedId;
export const getNodeById = (id) => state.nodes.find(n => n.id === id);
export const getStartNode = () => state.nodes.find(n => n.type === 'start');

export function setMode(mode) { state.mode = mode; }
export function setSelectedId(id) { state.selectedId = id; }

export function updateNodeText(id, text) {
  const node = getNodeById(id);
  if (node) node.text = text;
}

export function updateNodePosition(id, x, y) {
  const node = getNodeById(id);
  if (node) { node.position.x = x; node.position.y = y; }
}

export function addNode(parentId, optionLabel) {
  const parent = getNodeById(parentId);
  const newId = String(Date.now());
  const newNode = {
    id: newId,
    type: 'end',
    text: 'New Node',
    position: { x: parent.position.x + 260, y: parent.position.y + 180 },
    options: [],
  };
  state.nodes.push(newNode);
  parent.options.push({ label: optionLabel || 'New Option', nextId: newId });
  return newId;
}

export function deleteNode(id) {
  state.nodes = state.nodes.filter(n => n.id !== id);
  state.nodes.forEach(n => {
    n.options = n.options.filter(o => o.nextId !== id);
  });
  if (state.selectedId === id) state.selectedId = null;
}
