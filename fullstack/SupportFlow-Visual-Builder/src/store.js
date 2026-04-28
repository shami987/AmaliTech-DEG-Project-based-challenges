import flowData from '../flow_data.json' assert { type: 'json' };

const state = {
  nodes: flowData.nodes.map(n => ({ ...n, position: { ...n.position } })),
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
