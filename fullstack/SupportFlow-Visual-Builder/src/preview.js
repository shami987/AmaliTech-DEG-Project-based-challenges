import { getStartNode, getNodeById } from './store.js';

export function initPreview() {
  const preview = document.getElementById('preview-mode');
  preview.innerHTML = `
    <div id="chat-window">
      <div id="chat-header">SupportFlow Bot</div>
      <div id="chat-messages"></div>
      <div id="chat-options"></div>
    </div>
  `;
}

export function startPreview() {
  const preview = document.getElementById('preview-mode');
  preview.classList.add('open');
  document.getElementById('app').querySelector('#canvas-wrap').style.display = 'none';
  document.getElementById('edit-panel').style.display = 'none';

  const messages = document.getElementById('chat-messages');
  const options = document.getElementById('chat-options');
  messages.innerHTML = '';
  options.innerHTML = '';

  showNode(getStartNode(), messages, options);
}

export function stopPreview() {
  document.getElementById('preview-mode').classList.remove('open');
  document.getElementById('app').querySelector('#canvas-wrap').style.display = '';
}

function showNode(node, messages, options) {
  // Bot bubble
  const bubble = document.createElement('div');
  bubble.className = 'chat-bubble bot';
  bubble.textContent = node.text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;

  options.innerHTML = '';

  if (!node.options.length) {
    // Leaf node — show restart
    const btn = document.createElement('button');
    btn.className = 'btn btn-primary';
    btn.textContent = '↺ Restart';
    btn.style.alignSelf = 'center';
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
      // User bubble
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
