(() => {
  'use strict';

  const STORAGE_KEY = 'star_ai_access_token_v1';
  const MAX_HISTORY_MESSAGES = 8;
  const SUGGESTION_COUNT_MIN = 5;
  const SUGGESTION_COUNT_MAX = 6;
  const suggestionTopics = [
    ['科学', ['天空为什么是蓝色的？', '恐龙为什么会灭绝？', '月亮为什么会变形状？', '彩虹是怎么形成的？', '植物晚上也会呼吸吗？']],
    ['数学', ['出一道有趣的数学题', '教我一个快速心算的小技巧', '用故事讲讲什么是分数', '给我出一道找规律题', '生活中哪些地方会用到乘法？']],
    ['语文', ['讲一个有趣的成语故事', '教我猜一个字谜', '陪我用三个词编个小故事', '推荐一句适合小朋友的古诗', '怎样把一段话写得更生动？']],
    ['英语', ['教我一句日常英语', '陪我练习三句英语对话', '教我五个动物的英文单词', '用简单英语介绍我的家人', '出一道英语单词小游戏']],
    ['探索', ['给我一个在家能做的小实验', '今天可以观察什么大自然现象？', '讲一个中国传统节日的故事', '为什么要保护小动物？', '教我一个安全又有趣的手工']],
    ['成长', ['怎样更快地整理好书包？', '紧张的时候怎样让自己放松？', '怎样制定今天的学习计划？', '和朋友闹矛盾了怎么办？', '给我一个今天可以完成的小挑战']]
  ];
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

  function shuffle(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function createSuggestions() {
    const count = SUGGESTION_COUNT_MIN + Math.floor(
      Math.random() * (SUGGESTION_COUNT_MAX - SUGGESTION_COUNT_MIN + 1)
    );
    const topics = shuffle(suggestionTopics);
    const questions = topics.slice(0, count).map(([, topicQuestions]) => (
      topicQuestions[Math.floor(Math.random() * topicQuestions.length)]
    ));

    suggestions.replaceChildren(...questions.map((question) => {
      const button = document.createElement('button');
      button.className = 'aiq-suggestion';
      button.type = 'button';
      button.textContent = question;
      return button;
    }));
    suggestions.hidden = false;
    body.appendChild(suggestions);
  }

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
      createSuggestions();
      refreshAuthState();
      scrollToLatest();
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

  function appendInlineMarkdown(parent, source) {
    const pattern = /(`[^`\n]+`|\*\*[^*\n]+(?:\*(?!\*)[^*\n]*)*\*\*|__[^_\n]+(?:_(?!_)[^_\n]*)*__|~~[^~\n]+~~|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|\*[^*\n]+\*|_[^_\n]+_)/g;
    let cursor = 0;
    let match;

    while ((match = pattern.exec(source)) !== null) {
      if (match.index > cursor) parent.appendChild(document.createTextNode(source.slice(cursor, match.index)));

      const token = match[0];
      let element;
      let content;

      if (token.startsWith('**') || token.startsWith('__')) {
        element = document.createElement('strong');
        content = token.slice(2, -2);
      } else if (token.startsWith('~~')) {
        element = document.createElement('del');
        content = token.slice(2, -2);
      } else if (token.startsWith('`')) {
        element = document.createElement('code');
        content = token.slice(1, -1);
      } else if (token.startsWith('[')) {
        const closing = token.lastIndexOf('](');
        element = document.createElement('a');
        content = token.slice(1, closing);
        element.href = token.slice(closing + 2, -1);
        element.target = '_blank';
        element.rel = 'noopener noreferrer';
      } else {
        element = document.createElement('em');
        content = token.slice(1, -1);
      }

      element.textContent = content;
      parent.appendChild(element);
      cursor = pattern.lastIndex;
    }

    if (cursor < source.length) parent.appendChild(document.createTextNode(source.slice(cursor)));
  }

  function renderMarkdown(container, markdown) {
    const fragment = document.createDocumentFragment();
    const lines = String(markdown || '').replace(/\r\n?/g, '\n').split('\n');
    let paragraphLines = [];
    let activeList = null;
    let activeListType = '';
    let codeLines = null;
    let codeLanguage = '';

    const appendLines = (element, contentLines) => {
      contentLines.forEach((line, index) => {
        if (index) element.appendChild(document.createElement('br'));
        appendInlineMarkdown(element, line);
      });
    };

    const flushParagraph = () => {
      if (!paragraphLines.length) return;
      const paragraph = document.createElement('p');
      appendLines(paragraph, paragraphLines);
      fragment.appendChild(paragraph);
      paragraphLines = [];
    };

    const closeList = () => {
      activeList = null;
      activeListType = '';
    };

    const flushCode = () => {
      const pre = document.createElement('pre');
      const code = document.createElement('code');
      if (codeLanguage) code.dataset.language = codeLanguage;
      code.textContent = codeLines.join('\n');
      pre.appendChild(code);
      fragment.appendChild(pre);
      codeLines = null;
      codeLanguage = '';
    };

    lines.forEach((line) => {
      if (codeLines) {
        if (/^\s*```\s*$/.test(line)) flushCode();
        else codeLines.push(line);
        return;
      }

      const fence = line.match(/^\s*```\s*([\w+-]*)\s*$/);
      if (fence) {
        flushParagraph();
        closeList();
        codeLines = [];
        codeLanguage = fence[1] || '';
        return;
      }

      if (!line.trim()) {
        flushParagraph();
        closeList();
        return;
      }

      if (/^\s{0,3}((\*\s*){3,}|(-\s*){3,}|(_\s*){3,})$/.test(line)) {
        flushParagraph();
        closeList();
        fragment.appendChild(document.createElement('hr'));
        return;
      }

      const heading = line.match(/^\s{0,3}(#{1,4})\s+(.+)$/);
      if (heading) {
        flushParagraph();
        closeList();
        const element = document.createElement(`h${heading[1].length}`);
        appendInlineMarkdown(element, heading[2]);
        fragment.appendChild(element);
        return;
      }

      const quote = line.match(/^\s{0,3}>\s?(.*)$/);
      if (quote) {
        flushParagraph();
        closeList();
        const element = document.createElement('blockquote');
        appendInlineMarkdown(element, quote[1]);
        fragment.appendChild(element);
        return;
      }

      const listItem = line.match(/^\s{0,3}([-+*])\s+(.+)$/) || line.match(/^\s{0,3}(\d+)[.)]\s+(.+)$/);
      if (listItem) {
        flushParagraph();
        const type = /^\d+$/.test(listItem[1]) ? 'ol' : 'ul';
        if (!activeList || activeListType !== type) {
          activeList = document.createElement(type);
          activeListType = type;
          fragment.appendChild(activeList);
        }
        const item = document.createElement('li');
        appendInlineMarkdown(item, listItem[2]);
        activeList.appendChild(item);
        return;
      }

      closeList();
      paragraphLines.push(line);
    });

    if (codeLines) flushCode();
    flushParagraph();
    container.classList.add('aiq-markdown');
    container.replaceChildren(fragment);
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
          renderMarkdown(thinking.bubble, answer);
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

  suggestions.addEventListener('click', (event) => {
    const button = event.target.closest('.aiq-suggestion');
    if (!button) return;
    input.value = button.textContent;
    resizeInput();
    if (getAccessToken()) sendMessage(input.value.trim());
    else accessCodeInput.focus();
  });

  refreshAuthState();
})();
