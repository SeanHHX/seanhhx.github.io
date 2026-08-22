(() => {
  'use strict';

  const STORAGE_KEY = 'star_ai_access_token_v1';
  const CHAT_HISTORY_STORAGE_KEY = 'star_ai_chat_history_v1';
  const MAX_HISTORY_MESSAGES = 8;
  const MAX_CONVERSATIONS = 20;
  const MAX_CONVERSATION_MESSAGES = 40;
  const SUGGESTION_COUNT_MIN = 5;
  const SUGGESTION_COUNT_MAX = 6;
  const SUGGESTION_TIMEOUT_MS = 20000;
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
    suggestionAbortController: null,
    suggestionRequestId: 0,
    lastFocused: null,
    messages: [],
    conversations: [],
    activeConversationId: null,
    historyOpen: false
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
      <div class="aiq-header-actions">
        <button class="aiq-history-toggle" type="button" aria-label="查看对话历史" aria-expanded="false">
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
          <span>历史</span>
        </button>
        <button class="aiq-close" type="button" aria-label="关闭 AI 问答">×</button>
      </div>
    </header>
    <div class="aiq-history-shade" data-open="false" aria-hidden="true"></div>
    <aside class="aiq-history-drawer" data-open="false" aria-hidden="true" aria-label="对话历史">
      <div class="aiq-history-header">
        <div>
          <div class="aiq-history-title">对话历史</div>
          <div class="aiq-history-subtitle">保存在当前浏览器</div>
        </div>
        <button class="aiq-new-chat" type="button">
          <span aria-hidden="true">＋</span> 新对话
        </button>
      </div>
      <div class="aiq-history-list" data-aiq-history-list></div>
      <div class="aiq-history-note">最多保存 20 个会话，较早记录会自动移除。</div>
    </aside>
    <div class="aiq-body" aria-live="polite" aria-label="对话内容">
      <div class="aiq-message aiq-welcome" data-role="assistant">
        <div class="aiq-message-avatar" aria-hidden="true">✦</div>
        <div class="aiq-bubble">你好呀！我是运行在家中电脑上的星辰 AI。可以问我学习、生活和科学小问题。</div>
      </div>
      <div class="aiq-conversation" data-aiq-conversation></div>
      <div class="aiq-suggestion-block">
        <div class="aiq-suggestion-header">
          <span>试试这样问</span>
          <span class="aiq-suggestion-status" data-aiq-suggestion-status aria-live="polite"></span>
        </div>
        <div class="aiq-suggestions" aria-label="推荐问题">
        </div>
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
  const historyToggle = panel.querySelector('.aiq-history-toggle');
  const historyShade = panel.querySelector('.aiq-history-shade');
  const historyDrawer = panel.querySelector('.aiq-history-drawer');
  const historyList = panel.querySelector('[data-aiq-history-list]');
  const newChatButton = panel.querySelector('.aiq-new-chat');
  const body = panel.querySelector('.aiq-body');
  const welcome = panel.querySelector('.aiq-welcome');
  const conversation = panel.querySelector('[data-aiq-conversation]');
  const composer = panel.querySelector('.aiq-composer');
  const input = panel.querySelector('.aiq-input');
  const sendButton = panel.querySelector('.aiq-send');
  const authForm = panel.querySelector('[data-aiq-auth]');
  const accessCodeInput = panel.querySelector('#aiq-access-code');
  const statusText = panel.querySelector('[data-aiq-status]');
  const suggestionBlock = panel.querySelector('.aiq-suggestion-block');
  const suggestionStatus = panel.querySelector('[data-aiq-suggestion-status]');
  const suggestions = panel.querySelector('.aiq-suggestions');

  function loadConversations() {
    try {
      const parsed = JSON.parse(window.localStorage.getItem(CHAT_HISTORY_STORAGE_KEY) || '[]');
      if (!Array.isArray(parsed)) return [];
      return parsed.map((item) => {
        if (!item || typeof item !== 'object' || typeof item.id !== 'string' || !Array.isArray(item.messages)) return null;
        const messages = item.messages
          .filter((message) => (
            message &&
            (message.role === 'user' || message.role === 'assistant') &&
            typeof message.content === 'string' &&
            message.content.trim()
          ))
          .slice(-MAX_CONVERSATION_MESSAGES)
          .map((message) => ({ role: message.role, content: message.content.slice(0, 6000) }));
        if (!messages.length) return null;
        const createdAt = Number.isFinite(item.createdAt) ? item.createdAt : Date.now();
        const updatedAt = Number.isFinite(item.updatedAt) ? item.updatedAt : createdAt;
        return {
          id: item.id,
          title: typeof item.title === 'string' && item.title.trim() ? item.title.trim().slice(0, 40) : '学习对话',
          createdAt,
          updatedAt,
          messages
        };
      }).filter(Boolean).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, MAX_CONVERSATIONS);
    } catch (_) {
      return [];
    }
  }

  function persistConversations() {
    state.conversations.sort((a, b) => b.updatedAt - a.updatedAt);
    state.conversations = state.conversations.slice(0, MAX_CONVERSATIONS);
    try {
      window.localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(state.conversations));
      return true;
    } catch (_) {
      while (state.conversations.length > 1) {
        state.conversations.pop();
        try {
          window.localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(state.conversations));
          return true;
        } catch (_) {
          // 存储空间不足时继续移除最早的历史，优先保留最近会话。
        }
      }
      return false;
    }
  }

  function createConversationId() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function conversationTitle(message) {
    const compact = String(message || '').replace(/\s+/g, ' ').trim();
    return compact.length > 24 ? `${compact.slice(0, 24)}…` : compact || '学习对话';
  }

  function saveActiveConversation() {
    if (!state.messages.length) return;
    const now = Date.now();
    let item = state.conversations.find((conversationItem) => conversationItem.id === state.activeConversationId);
    if (!item) {
      item = {
        id: createConversationId(),
        title: conversationTitle(state.messages.find((message) => message.role === 'user')?.content),
        createdAt: now,
        updatedAt: now,
        messages: []
      };
      state.activeConversationId = item.id;
      state.conversations.unshift(item);
    }
    item.updatedAt = now;
    item.messages = state.messages.slice(-MAX_CONVERSATION_MESSAGES).map((message) => ({
      role: message.role,
      content: message.content
    }));
    persistConversations();
    renderHistoryList();
  }

  function formatHistoryTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const sameDay = date.toDateString() === now.toDateString();
    if (sameDay) return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(date);
    return new Intl.DateTimeFormat('zh-CN', { month: 'numeric', day: 'numeric' }).format(date);
  }

  function renderHistoryList() {
    if (!state.conversations.length) {
      const empty = document.createElement('div');
      empty.className = 'aiq-history-empty';
      empty.innerHTML = '<span aria-hidden="true">✦</span><strong>还没有对话记录</strong><small>提出第一个问题后会自动保存在这里。</small>';
      historyList.replaceChildren(empty);
      return;
    }

    historyList.replaceChildren(...state.conversations.map((item) => {
      const row = document.createElement('div');
      row.className = 'aiq-history-row';
      if (item.id === state.activeConversationId) row.dataset.active = 'true';

      const openButton = document.createElement('button');
      openButton.className = 'aiq-history-item';
      openButton.type = 'button';
      openButton.dataset.conversationId = item.id;
      if (item.id === state.activeConversationId) openButton.setAttribute('aria-current', 'true');

      const title = document.createElement('span');
      title.className = 'aiq-history-item-title';
      title.textContent = item.title;
      const meta = document.createElement('span');
      meta.className = 'aiq-history-item-meta';
      meta.textContent = `${Math.ceil(item.messages.length / 2)} 轮 · ${formatHistoryTime(item.updatedAt)}`;
      openButton.append(title, meta);

      const deleteButton = document.createElement('button');
      deleteButton.className = 'aiq-history-delete';
      deleteButton.type = 'button';
      deleteButton.dataset.deleteConversationId = item.id;
      deleteButton.setAttribute('aria-label', `删除对话：${item.title}`);
      deleteButton.textContent = '×';
      row.append(openButton, deleteButton);
      return row;
    }));
  }

  function setHistoryOpen(open) {
    if (open && state.sending) return;
    state.historyOpen = open;
    historyDrawer.dataset.open = String(open);
    historyShade.dataset.open = String(open);
    historyDrawer.setAttribute('aria-hidden', String(!open));
    historyShade.setAttribute('aria-hidden', String(!open));
    historyToggle.setAttribute('aria-expanded', String(open));
    if (open) {
      renderHistoryList();
      window.setTimeout(() => {
        if (state.historyOpen) newChatButton.focus();
      }, 80);
    }
  }

  function renderActiveConversation() {
    conversation.replaceChildren();
    welcome.hidden = state.messages.length > 0;
    state.messages.forEach((message) => {
      const rendered = appendMessage(message.role, message.content, { scroll: false });
      if (message.role === 'assistant') renderMarkdown(rendered.bubble, message.content);
    });
    suggestionBlock.hidden = state.messages.length > 0;
    scrollToLatest();
  }

  function startNewConversation() {
    if (state.sending) return;
    state.activeConversationId = null;
    state.messages = [];
    renderActiveConversation();
    setHistoryOpen(false);
    if (state.open) {
      createLocalSuggestions();
      generateAISuggestions();
      if (getAccessToken()) input.focus();
    }
  }

  function openConversation(id) {
    if (state.sending) return;
    const item = state.conversations.find((conversationItem) => conversationItem.id === id);
    if (!item) return;
    cancelSuggestionGeneration();
    state.activeConversationId = item.id;
    state.messages = item.messages.map((message) => ({ role: message.role, content: message.content }));
    renderActiveConversation();
    setHistoryOpen(false);
    if (getAccessToken()) input.focus();
  }

  function shuffle(items) {
    const result = items.slice();
    for (let index = result.length - 1; index > 0; index -= 1) {
      const target = Math.floor(Math.random() * (index + 1));
      [result[index], result[target]] = [result[target], result[index]];
    }
    return result;
  }

  function renderSuggestions(questions) {
    suggestions.replaceChildren(...questions.map((question) => {
      const button = document.createElement('button');
      button.className = 'aiq-suggestion';
      button.type = 'button';
      button.textContent = question;
      return button;
    }));
  }

  function createLocalSuggestions() {
    const count = SUGGESTION_COUNT_MIN + Math.floor(
      Math.random() * (SUGGESTION_COUNT_MAX - SUGGESTION_COUNT_MIN + 1)
    );
    const topics = shuffle(suggestionTopics);
    const questions = topics.slice(0, count).map(([, topicQuestions]) => (
      topicQuestions[Math.floor(Math.random() * topicQuestions.length)]
    ));

    renderSuggestions(questions);
    suggestionStatus.textContent = '本地推荐';
    suggestionBlock.hidden = false;
    body.appendChild(suggestionBlock);
  }

  function cancelSuggestionGeneration() {
    state.suggestionRequestId += 1;
    if (state.suggestionAbortController) state.suggestionAbortController.abort();
    state.suggestionAbortController = null;
    suggestionBlock.removeAttribute('aria-busy');
  }

  function parseGeneratedSuggestions(answer) {
    const match = String(answer || '').match(/\[[\s\S]*\]/);
    if (!match) return null;

    try {
      const parsed = JSON.parse(match[0]);
      if (!Array.isArray(parsed) || parsed.length < SUGGESTION_COUNT_MIN || parsed.length > SUGGESTION_COUNT_MAX) return null;
      const questions = parsed.map((question) => String(question).trim());
      const valid = questions.every((question) => (
        question.length >= 4 && question.length <= 40 && !/[\r\n]/.test(question)
      ));
      if (!valid || new Set(questions).size !== questions.length) return null;
      return questions;
    } catch (_) {
      return null;
    }
  }

  async function generateAISuggestions() {
    const token = getAccessToken();
    if (!token || !state.open) return;

    cancelSuggestionGeneration();
    const requestId = state.suggestionRequestId;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), SUGGESTION_TIMEOUT_MS);
    state.suggestionAbortController = controller;
    suggestionStatus.textContent = 'AI 正在更新…';
    suggestionBlock.setAttribute('aria-busy', 'true');

    const referenceQuestions = suggestionTopics.flatMap(([, questions]) => questions).join('；');
    const prompt = [
      '请参考下面的儿童学习题库，生成 5 或 6 个新的推荐问题。',
      '要求：适合小学生，主题尽量多样，表达简短自然，不索取个人信息，不包含危险操作。',
      '不要回答问题，只返回 JSON 字符串数组，不要使用 Markdown。',
      `参考题库：${referenceQuestions}`
    ].join('\n');

    try {
      const response = await fetch(`${apiBase}/api/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream'
        },
        body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
        signal: controller.signal
      });

      if (response.status === 401) {
        setAccessToken('');
        refreshAuthState();
      }
      if (!response.ok || !response.body) throw new Error('suggestions unavailable');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let answer = '';
      const handleEvent = (data) => {
        if (!data || data === '[DONE]') return;
        const payload = JSON.parse(data);
        if (payload.error) throw new Error(payload.error);
        if (payload.delta) answer += payload.delta;
      };

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        buffer = parseSSEBuffer(buffer.replace(/\r\n/g, '\n'), handleEvent);
        if (done) break;
      }
      if (buffer.trim()) parseSSEBuffer(`${buffer}\n\n`, handleEvent);

      const generated = parseGeneratedSuggestions(answer);
      if (!generated) throw new Error('invalid suggestions');
      if (requestId !== state.suggestionRequestId || !state.open) return;
      renderSuggestions(generated);
      suggestionStatus.textContent = 'AI 推荐';
      scrollToLatest();
    } catch (_) {
      if (requestId === state.suggestionRequestId && state.open) suggestionStatus.textContent = '本地推荐';
    } finally {
      window.clearTimeout(timeoutId);
      if (requestId === state.suggestionRequestId) {
        state.suggestionAbortController = null;
        suggestionBlock.removeAttribute('aria-busy');
      }
    }
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
    historyToggle.disabled = state.sending;
    newChatButton.disabled = state.sending;
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
      if (!state.messages.length) {
        createLocalSuggestions();
        generateAISuggestions();
      } else {
        suggestionBlock.hidden = true;
      }
      scrollToLatest();
      window.setTimeout(() => {
        if (getAccessToken()) input.focus();
        else accessCodeInput.focus();
      }, 80);
    } else {
      cancelSuggestionGeneration();
      setHistoryOpen(false);
      if (state.lastFocused && typeof state.lastFocused.focus === 'function') state.lastFocused.focus();
    }
  }

  function scrollToLatest() {
    window.requestAnimationFrame(() => { body.scrollTop = body.scrollHeight; });
  }

  function appendInlineMarkdown(parent, source) {
    const pattern = /(`[^`\n]+`|[A-Za-z0-9)\]]\s*\*\s*(?=[A-Za-z0-9(\[])|\*(?![\s*])(?:[^*\n]|\*\*[^*\n]+\*\*)+\*|\*\*[^*\n]+(?:\*(?!\*)[^*\n]*)*\*\*|__[^_\n]+(?:_(?!_)[^_\n]*)*__|~~[^~\n]+~~|\[[^\]\n]+\]\(https?:\/\/[^\s)]+\)|_[^_\n]+_)/g;
    let cursor = 0;
    let match;

    while ((match = pattern.exec(source)) !== null) {
      if (match.index > cursor) parent.appendChild(document.createTextNode(source.slice(cursor, match.index)));

      const token = match[0];
      let element;
      let content;

      if (/^[A-Za-z0-9)\]]\s*\*\s*$/.test(token)) {
        parent.appendChild(document.createTextNode(token.replace(/\s*\*\s*$/, ' × ')));
        cursor = pattern.lastIndex;
        continue;
      } else if (token.startsWith('**') || token.startsWith('__')) {
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

      if (element.matches('strong, em, del')) appendInlineMarkdown(element, content);
      else element.textContent = content;
      parent.appendChild(element);
      cursor = pattern.lastIndex;
    }

    if (cursor < source.length) parent.appendChild(document.createTextNode(source.slice(cursor)));
  }

  function cleanupOrphanMarkdownMarkers(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes.forEach((node) => {
      if (node.parentElement.closest('code, pre, .katex')) return;
      node.nodeValue = node.nodeValue
        .replace(/([A-Za-z0-9)\]])\s*\*\s*(?=[A-Za-z0-9(\[])/g, '$1 × ')
        .replace(/^\*{1,2}(?=\s+)/, '')
        .replace(/\*{1,2}(?=\s*(?:[，。！？、；：,.!?;:]|$))/g, '');
    });
  }

  function renderLatex(container) {
    if (typeof window.renderMathInElement !== 'function') return;
    try {
      window.renderMathInElement(container, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '\\[', right: '\\]', display: true },
          { left: '\\(', right: '\\)', display: false },
          { left: '$', right: '$', display: false }
        ],
        throwOnError: false,
        strict: 'ignore',
        trust: false
      });

      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);
      textNodes.forEach((node) => {
        if (node.parentElement.closest('.katex, code, pre')) return;
        let previous = node.previousSibling;
        while (previous && previous.nodeType === Node.TEXT_NODE && !previous.nodeValue.trim()) previous = previous.previousSibling;
        const followsMath = previous && previous.nodeType === Node.ELEMENT_NODE && previous.querySelector('.katex');
        if (followsMath) node.nodeValue = node.nodeValue.replace(/^\$(?=\s*(?:[，。！？、；：,.!?;:]|$))/, '');
      });
    } catch (_) {
      // 公式不完整或资源加载失败时保留原始文本，避免影响整段回答。
    }
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
    cleanupOrphanMarkdownMarkers(container);
    renderLatex(container);
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
    conversation.appendChild(wrapper);
    if (options.scroll !== false) scrollToLatest();
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

    cancelSuggestionGeneration();
    setHistoryOpen(false);
    suggestionBlock.hidden = true;
    welcome.hidden = true;
    appendMessage('user', message);
    state.messages.push({ role: 'user', content: message });
    state.messages = state.messages.slice(-MAX_CONVERSATION_MESSAGES);
    saveActiveConversation();
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
        body: JSON.stringify({ messages: state.messages.slice(-MAX_HISTORY_MESSAGES) }),
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
      state.messages = state.messages.slice(-MAX_CONVERSATION_MESSAGES);
      saveActiveConversation();
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
  historyToggle.addEventListener('click', () => setHistoryOpen(!state.historyOpen));
  historyShade.addEventListener('click', () => setHistoryOpen(false));
  newChatButton.addEventListener('click', startNewConversation);

  historyList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('[data-delete-conversation-id]');
    if (deleteButton) {
      const id = deleteButton.dataset.deleteConversationId;
      const item = state.conversations.find((conversationItem) => conversationItem.id === id);
      if (!item || !window.confirm(`删除“${item.title}”吗？删除后无法恢复。`)) return;
      state.conversations = state.conversations.filter((conversationItem) => conversationItem.id !== id);
      persistConversations();
      if (state.activeConversationId === id) startNewConversation();
      else renderHistoryList();
      return;
    }

    const openButton = event.target.closest('[data-conversation-id]');
    if (openButton) openConversation(openButton.dataset.conversationId);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && state.open) {
      if (state.historyOpen) setHistoryOpen(false);
      else if (state.sending && state.abortController) state.abortController.abort();
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
    generateAISuggestions();
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

  state.conversations = loadConversations();
  renderHistoryList();
  refreshAuthState();
})();
