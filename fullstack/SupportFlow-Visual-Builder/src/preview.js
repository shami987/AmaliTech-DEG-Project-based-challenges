import { getStartNode, getNodeById } from './store.js';

export function initPreview() {
  document.getElementById('preview-mode').innerHTML = `
    <div id="chat-window">
      <div id="chat-header">SupportFlow Bot</div>
      <div id="chat-messages"></div>
      <div id="chat-options"></div>
    </div>
  `;
}

export function startPreview() {
  document.getElementById('editor-view').classList.add('hidden');
  document.getElementById('preview-mode').classList.add('open');

  const messages = document.getElementById('chat-messages');
  const options = document.getElementById('chat-options');
  messages.innerHTML = '';
  options.innerHTML = '';
  showNode(getStartNode(), messages, options);
}

export function stopPreview() {
  document.getElementById('preview-mode').classList.remove('open');
  document.getElementById('editor-view').classList.remove('hidden');
}

function showNode(node, messages, options) {
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  bubble.textContent = node.text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;

  options.innerHTML = '';

  if (!node.options.length) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.style.margin = '0 auto';
    btn.textContent = '↺ Restart';
    btn.addEventListener('click', () => {
      messages.innerHTML = '';
      showNode(getStartNode(), messages, options);
    });
    options.appendChild(btn);
    return;
  }

  node.options.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'chat-option-btn';
    btn.textContent = opt.label;
    btn.addEventListener('click', () => {
      const userBubble = document.createElement('div');
      userBubble.className = 'chat-bubble user';
      userBubble.textContent = opt.label;
      messages.appendChild(userBubble);
      options.innerHTML = '';
      const next = getNodeById(opt.nextId);
      if (next) setTimeout(() => showNode(next, messages, options), 400);
    });
    options.appendChild(btn);
  });
}
