(() => {
  'use strict';

  const STORAGE_KEY = 'star_ai_access_token_v1';
  const MAX_HISTORY_MESSAGES = 8;
  const localHostnames = new Set(['localhost', '127.0.0.1']);
  const config = window.AI_CHAT_CONFIG || {};
  const apiBase = String(
    config.apiBase ||
    (localHostnames.has(window.location.hostname)
      ? 'http://127.0.0.1:8787'
      : 'https://hmacmini.tail1177f0.ts.net')
  ).replace(/\/$/, '');

  const state = {
    open: false,
    sending: false,
    abortController: null,
    lastFocused: null,
    messages: []
  };

  const host = document.querySelector('[data-ai-chat-launcher]');
  if (!host) return;

  host.classList.add('aiq-launcher-host');
  host.innerHTML = `
    <button class="aiq-launcher" type="button" aria-label="打开星辰 AI 问答" aria-haspopup="dialog" aria-expanded="false">
      <span class="aiq-launcher-icon" aria-hidden="true">✦</span>
      <span class="aiq-launcher-label">AI 问答</span>
    </button>
  `;

  const backdrop = document.createElement('div');
  backdrop.className = 'aiq-backdrop';
  backdrop.dataset.open = 'false';
  backdrop.setAttribute('aria-hidden', 'true');

  const panel = document.createElement('section');
  panel.className = 'aiq-panel';
  panel.dataset.open = 'false';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-labelledby', 'aiq-title');
  panel.setAttribute('aria-hidden', 'true');
  panel.innerHTML = `
    <header class="aiq-header">
      <div class="aiq-identity">
        <div class="aiq-avatar" aria-hidden="true">✦</div>
        <div>
          <h2 class="aiq-title" id="aiq-title">星辰 AI 小助手</h2>
          <div class="aiq-subtitle"><span class="aiq-status-dot"></span><span data-aiq-status>本地模型 · 隐私运行</span></div>
        </div>
      </div>
      <button class="aiq-close" type="button" aria-label="关闭 AI 问答">×</button>
    </header>
    <div class="aiq-body" aria-live="polite" aria-label="对话内容">
      <div class="aiq-message" data-role="assistant">
        <div class="aiq-message-avatar" aria-hidden="true">✦</div>
        <div class="aiq-bubble">你好呀！我是运行在家中电脑上的星辰 AI。可以问我学习、生活和科学小问题。</div>
      </div>
      <div class="aiq-suggestions" aria-label="推荐问题">
        <button class="aiq-suggestion" type="button">为什么天空是蓝色？</button>
        <button class="aiq-suggestion" type="button">出一道有趣的数学题</button>
        <button class="aiq-suggestion" type="button">教我一句日常英语</button>
      </div>
      <form class="aiq-auth" data-aiq-auth autocomplete="off">
        <label class="aiq-auth-label" for="aiq-access-code">首次使用请输入家庭访问码</label>
        <div class="aiq-auth-row">
          <input id="aiq-access-code" name="accessCode" type="password" inputmode="text" maxlength="128" placeholder="访问码" aria-describedby="aiq-auth-help">
          <button type="submit">保存</button>
        </div>
        <div id="aiq-auth-help" class="aiq-note">访问码仅保存在当前浏览器，不会写入聊天记录。</div>
      </form>
    </div>
    <form class="aiq-composer">
      <div class="aiq-input-wrap">
        <textarea class="aiq-input" rows="1" maxlength="2000" placeholder="输入你的问题…" aria-label="输入问题"></textarea>
        <button class="aiq-send" type="submit" aria-label="发送问题">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
      <div class="aiq-note">回答由本地 AI 生成，重要信息请和家长或老师确认。</div>
    </form>
  `;

  document.body.append(backdrop, panel);

  const launcher = host.querySelector('.aiq-launcher');
  const closeButton = panel.querySelector('.aiq-close');
  const body = panel.querySelector('.aiq-body');
  const composer = panel.querySelector('.aiq-composer');
  const input = panel.querySelector('.aiq-input');
  const sendButton = panel.querySelector('.aiq-send');
  const authForm = panel.querySelector('[data-aiq-auth]');
  const accessCodeInput = panel.querySelector('#aiq-access-code');
  const statusText = panel.querySelector('[data-aiq-status]');
  const suggestions = panel.querySelector('.aiq-suggestions');

  function getAccessToken() {
    try { return window.localStorage.getItem(STORAGE_KEY) || ''; }
    catch (_) { return ''; }
  }

  function setAccessToken(token) {
    try {
      if (token) window.localStorage.setItem(STORAGE_KEY, token);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // Safari 私密模式可能禁用存储；本次输入仍保留在表单中。
    }
  }

  function refreshAuthState() {
    const hasToken = Boolean(getAccessToken());
    authForm.hidden = hasToken;
    input.disabled = !hasToken || state.sending;
    sendButton.disabled = !hasToken || state.sending || !input.value.trim();
    statusText.textContent = hasToken ? '本地模型 · 隐私运行' : '需要家庭访问码';
  }

  function setOpen(open) {
    state.open = open;
    panel.dataset.open = String(open);
    backdrop.dataset.open = String(open);
    panel.setAttribute('aria-hidden', String(!open));
    backdrop.setAttribute('aria-hidden', String(!open));
    launcher.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('aiq-lock-scroll', open && window.innerWidth <= 780);

    if (open) {
      state.lastFocused = document.activeElement;
      refreshAuthState();
      window.setTimeout(() => {
        if (getAccessToken()) input.focus();
        else accessCodeInput.focus();
      }, 80);
    } else {
      if (state.lastFocused && typeof state.lastFocused.focus === 'function') state.lastFocused.focus();
    }
  }

  function scrollToLatest() {
    window.requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
  }

  function appendMessage(role, text, options = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'aiq-message';
    wrapper.dataset.role = role;
    if (options.state) wrapper.dataset.state = options.state;

    if (role === 'assistant') {
      const avatar = document.createElement('div');
      avatar.className = 'aiq-message-avatar';
      avatar.setAttribute('aria-hidden', 'true');
      avatar.textContent = '✦';
      wrapper.appendChild(avatar);
    }

    const bubble = document.createElement('div');
    bubble.className = 'aiq-bubble';
    bubble.textContent = text;
    wrapper.appendChild(bubble);
    body.appendChild(wrapper);
    scrollToLatest();
    return { wrapper, bubble };
  }

  function appendThinking() {
    const result = appendMessage('assistant', '');
    result.wrapper.dataset.state = 'thinking';
    result.bubble.innerHTML = '<span class="aiq-thinking" aria-label="正在思考"><i></i><i></i><i></i></span>';
    return result;
  }

  function resizeInput() {
    input.style.height = 'auto';
    input.style.height = `${Math.min(input.scrollHeight, 112)}px`;
    sendButton.disabled = !getAccessToken() || state.sending || !input.value.trim();
  }

  function parseSSEBuffer(buffer, onEvent) {
    const blocks = buffer.split('\n\n');
    const remainder = blocks.pop() || '';
    blocks.forEach((block) => {
      const dataLines = block.split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart());
      if (dataLines.length) onEvent(dataLines.join('\n'));
    });
    return remainder;
  }

  async function sendMessage(message) {
    if (state.sending || !message) return;
    const token = getAccessToken();
    if (!token) {
      refreshAuthState();
      accessCodeInput.focus();
      return;
    }

    suggestions.hidden = true;
    appendMessage('user', message);
    state.messages.push({ role: 'user', content: message });
    state.messages = state.messages.slice(-MAX_HISTORY_MESSAGES);
    input.value = '';
    resizeInput();

    const thinking = appendThinking();
    state.sending = true;
    state.abortController = new AbortController();
    refreshAuthState();
    statusText.textContent = '正在思考…';

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ messages: state.messages }),
        signal: state.abortController.signal
      });

      if (response.status === 401) {
        setAccessToken('');
        throw new Error('访问码不正确，请重新输入。');
      }
      if (response.status === 429) throw new Error('提问有点频繁，请稍后再试。');
      if (response.status === 503) throw new Error('小助手正在回答另一个问题，请稍后再试。');
      if (!response.ok) throw new Error(`服务暂时不可用（${response.status}）`);
      if (!response.body) throw new Error('浏览器不支持流式回答。');

      thinking.wrapper.dataset.state = '';
      thinking.bubble.textContent = '';
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let answer = '';

      const handleEvent = (data) => {
        if (!data || data === '[DONE]') return;
        const payload = JSON.parse(data);
        if (payload.error) throw new Error(payload.error);
        if (payload.delta) {
          answer += payload.delta;
          thinking.bubble.textContent = answer;
          scrollToLatest();
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        buffer = parseSSEBuffer(buffer.replace(/\r\n/g, '\n'), handleEvent);
        if (done) break;
      }
      if (buffer.trim()) parseSSEBuffer(`${buffer}\n\n`, handleEvent);
      if (!answer.trim()) throw new Error('模型没有返回内容，请再问一次。');

      state.messages.push({ role: 'assistant', content: answer });
      state.messages = state.messages.slice(-MAX_HISTORY_MESSAGES);
    } catch (error) {
      if (error.name === 'AbortError') {
        thinking.wrapper.remove();
      } else {
        thinking.wrapper.dataset.state = 'error';
        thinking.bubble.textContent = error.message || '连接失败，请稍后再试。';
      }
    } finally {
      state.sending = false;
      state.abortController = null;
      refreshAuthState();
      if (state.open && getAccessToken()) input.focus();
    }
  }

  launcher.addEventListener('click', () => setOpen(true));
  closeButton.addEventListener('click', () => setOpen(false));
  backdrop.addEventListener('click', () => setOpen(false));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open) {
      if (state.sending && state.abortController) state.abortController.abort();
      else setOpen(false);
    }
  });

  authForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const token = accessCodeInput.value.trim();
    if (!token) return;
    setAccessToken(token);
    accessCodeInput.value = '';
    refreshAuthState();
    input.focus();
  });

  input.addEventListener('input', resizeInput);
  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.isComposing) {
      event.preventDefault();
      composer.requestSubmit();
    }
  });

  composer.addEventListener('submit', (event) => {
    event.preventDefault();
    sendMessage(input.value.trim());
  });

  panel.querySelectorAll('.aiq-suggestion').forEach((button) => {
    button.addEventListener('click', () => {
      input.value = button.textContent;
      resizeInput();
      if (getAccessToken()) sendMessage(input.value.trim());
      else accessCodeInput.focus();
    });
  });

  refreshAuthState();
})();
