(function () {
  "use strict";

  const EXTENSION_MODELS = [
    { slug: "anthropic/claude-3.5-sonnet", title: "Claude 3.5 Sonnet", provider: "Anthropic", tag: "Frontier Coding" },
    { slug: "deepseek/deepseek-r1", title: "DeepSeek R1", provider: "DeepSeek", tag: "Reasoning" },
    { slug: "openai/gpt-4o", title: "GPT-4o", provider: "OpenAI", tag: "Fast Omni" },
    { slug: "google/gemini-1.5-pro", title: "Gemini 1.5 Pro", provider: "Google", tag: "1M Context" },
    { slug: "meta/llama-3.3-70b-instruct", title: "Llama 3.3 70B", provider: "Meta", tag: "Open Weights" },
  ];

  const PRESET_CONTEXTS = {
    page: {
      type: "page",
      title: "React Documentation — Describing the UI",
      url: "https://react.dev/learn",
      domain: "react.dev",
      text: "React is a JavaScript library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript. Combine them into full screens, pages, and interactive web apps with React Server Components.",
      tokenEst: 140,
    },
    selection1: {
      type: "selection",
      text: "React is a JavaScript library for web and native user interfaces. Build user interfaces out of individual pieces called components written in JavaScript.",
      sourceTitle: "React Documentation",
      url: "https://react.dev/learn",
      domain: "react.dev",
      wordCount: 22,
      tokenEst: 35,
    },
    selection2: {
      type: "selection",
      text: "Hooks let you use state and other React features without writing a class. You can also create your own Hooks to share reusable stateful logic between components.",
      sourceTitle: "React Documentation — Hooks Overview",
      url: "https://react.dev/learn#hooks",
      domain: "react.dev",
      wordCount: 24,
      tokenEst: 38,
    },
  };

  const INITIAL_CHATS = [
    {
      id: "chat-1",
      title: "React Server Components Architecture",
      modelSlug: "anthropic/claude-3.5-sonnet",
      date: "Today",
      messages: [
        {
          role: "user",
          content: "Explain the mental model behind React Server Components and data fetching boundaries.",
        },
        {
          role: "assistant",
          modelTitle: "Claude 3.5 Sonnet",
          content:
            "React Server Components (RSC) execute exclusively on the server, producing a virtual DOM serialization stream rather than shipping executable JavaScript bundles to the client.\n\n### Key Principles:\n1. **Zero Bundle Impact**: Dependencies imported inside server components never enter the client bundle.\n2. **Direct Backend Access**: Query databases and microservices directly without REST or GraphQL wrappers.\n3. **Composable Boundaries**: Nest client components (`'use client'`) inside server component trees via the `children` prop.",
        },
      ],
    },
    {
      id: "chat-2",
      title: "TypeScript Invariant Validation",
      modelSlug: "deepseek/deepseek-r1",
      date: "Yesterday",
      messages: [
        {
          role: "user",
          content: "How do you enforce exhaustive checking with TypeScript discriminated unions?",
        },
        {
          role: "assistant",
          modelTitle: "DeepSeek R1",
          reasoning: "Thinking Process:\n1. Discriminated unions require a unique discriminant property.\n2. In a switch/case block, unhandled cases fall through to the default branch.\n3. In TypeScript, assigning an unhandled branch to the `never` type triggers a compiler error.\n4. Formulate the assertNever helper function.",
          content:
            "Use the `never` type in the default branch to achieve compile-time exhaustiveness:\n\n```typescript\nfunction assertNever(x: never): never {\n  throw new Error('Unhandled case: ' + JSON.stringify(x));\n}\n\ntype Action = { type: 'open' } | { type: 'close' };\n\nfunction handleAction(a: Action) {\n  switch (a.type) {\n    case 'open': return 'Opening...';\n    case 'close': return 'Closing...';\n    default: return assertNever(a);\n  }\n}\n```",
        },
      ],
    },
  ];

  const state = {
    conversations: INITIAL_CHATS,
    activeChatId: "chat-1",
    activeModelSlug: "anthropic/claude-3.5-sonnet",
    activeContext: PRESET_CONTEXTS.page,
    ambientPage: PRESET_CONTEXTS.page,
    theme: "dark",
    isGenerating: false,
    historySearch: "",
    autoContextEnabled: true,
    autoSelectionEnabled: true,
  };

  const chatCanvas = document.getElementById("chatCanvas");
  const promptInput = document.getElementById("promptInput");
  const sendBtn = document.getElementById("sendBtn");
  const modelPillBtn = document.getElementById("modelPillBtn");
  const activeModelLabel = document.getElementById("activeModelLabel");
  const newChatBtn = document.getElementById("newChatBtn");
  const historyBtn = document.getElementById("historyBtn");
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const settingsBtn = document.getElementById("settingsBtn");
  const errorBanner = document.getElementById("errorBanner");
  const errorMessage = document.getElementById("errorMessage");
  const retryErrorBtn = document.getElementById("retryErrorBtn");

  const contextHeroCard = document.getElementById("contextHeroCard");
  const composerContextIndicator = document.getElementById("composerContextIndicator");
  const composerCtxDot = document.getElementById("composerCtxDot");
  const composerCtxIntent = document.getElementById("composerCtxIntent");
  const composerCtxSource = document.getElementById("composerCtxSource");
  const composerCtxLabel = document.getElementById("composerCtxLabel");
  const composerCtxInspectBtn = document.getElementById("composerCtxInspectBtn");
  const composerCtxRemoveBtn = document.getElementById("composerCtxRemoveBtn");
  const composerDetachedBanner = document.getElementById("composerDetachedBanner");
  const composerQuickAttachBtn = document.getElementById("composerQuickAttachBtn");

  const contextInspectPanel = document.getElementById("contextInspectPanel");
  const closeInspectPanelBtn = document.getElementById("closeInspectPanelBtn");
  const inspectMetaTag = document.getElementById("inspectMetaTag");
  const inspectMetaTitle = document.getElementById("inspectMetaTitle");
  const inspectMetaUrl = document.getElementById("inspectMetaUrl");
  const inspectFullTextBox = document.getElementById("inspectFullTextBox");
  const inspectTokenStat = document.getElementById("inspectTokenStat");
  const inspectDetachBtn = document.getElementById("inspectDetachBtn");

  const modelPanel = document.getElementById("modelPanel");
  const closeModelPanelBtn = document.getElementById("closeModelPanelBtn");
  const modelListContainer = document.getElementById("modelListContainer");

  const historyPanel = document.getElementById("historyPanel");
  const closeHistoryPanelBtn = document.getElementById("closeHistoryPanelBtn");
  const historySearchInput = document.getElementById("historySearchInput");
  const historyListContainer = document.getElementById("historyListContainer");

  const settingsPanel = document.getElementById("settingsPanel");
  const closeSettingsPanelBtn = document.getElementById("closeSettingsPanelBtn");
  const themeDarkBtn = document.getElementById("themeDarkBtn");
  const themeLightBtn = document.getElementById("themeLightBtn");
  const autoContextCheckbox = document.getElementById("autoContextCheckbox");
  const autoSelectionCheckbox = document.getElementById("autoSelectionCheckbox");

  function init() {
    loadSettings();
    renderContextHeroCard();
    renderComposerContextIndicator();
    renderModelList();
    renderChatCanvas();
    setupEventListeners();
    listenToExternalContext();

    detectLiveBrowserContext()
      .then(() => {
        renderContextHeroCard();
        renderComposerContextIndicator();
      })
      .catch((err) => {
        console.warn("Background context detection skipped:", err);
      });
  }

  function loadSettings() {
    const savedTheme = localStorage.getItem("echogpt_ext_theme") || "dark";
    setTheme(savedTheme);

    const savedModel = localStorage.getItem("echogpt_ext_model");
    if (savedModel && EXTENSION_MODELS.some((m) => m.slug === savedModel)) {
      state.activeModelSlug = savedModel;
      updateActiveModelLabel();
    }

    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.get(["echogpt_theme", "echogpt_chats", "echogpt_model"], (data) => {
        if (data.echogpt_theme) setTheme(data.echogpt_theme);
        if (data.echogpt_model) {
          state.activeModelSlug = data.echogpt_model;
          updateActiveModelLabel();
        }
        if (data.echogpt_chats && data.echogpt_chats.length > 0) {
          state.conversations = data.echogpt_chats;
          renderChatCanvas();
        }
      });
    }
  }

  function setTheme(newTheme) {
    state.theme = newTheme;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("echogpt_ext_theme", newTheme);
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
      chrome.storage.local.set({ echogpt_theme: newTheme });
    }
  }

  function updateActiveModelLabel() {
    const model = EXTENSION_MODELS.find((m) => m.slug === state.activeModelSlug) || EXTENSION_MODELS[0];
    const parts = model.title.split(" ");
    activeModelLabel.textContent = parts.slice(0, 2).join(" ");
  }

  async function detectLiveBrowserContext() {
    if (!state.autoContextEnabled) return;

    if (typeof chrome !== "undefined" && chrome.tabs && chrome.scripting) {
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab && tab.id && tab.url && !tab.url.startsWith("chrome://")) {
          const domain = new URL(tab.url).hostname.replace("www.", "");
          state.ambientPage = {
            type: "page",
            title: tab.title || "Active Webpage",
            url: tab.url,
            domain: domain,
            text: "",
            tokenEst: 150,
          };

          const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              const sel = window.getSelection()?.toString().trim() || "";
              const clone = document.body.cloneNode(true);
              const junk = clone.querySelectorAll("script, style, nav, footer, noscript, svg");
              junk.forEach((el) => el.remove());
              const text = (clone.innerText || "").replace(/\s+/g, " ").trim().slice(0, 8000);
              return { selection: sel, text: text };
            },
          });

          if (results && results[0]?.result) {
            const res = results[0].result;
            state.ambientPage.text = res.text;
            if (res.selection && state.autoSelectionEnabled) {
              state.activeContext = {
                type: "selection",
                text: res.selection,
                sourceTitle: tab.title || "Webpage",
                url: tab.url,
                domain: domain,
                wordCount: res.selection.split(/\s+/).length,
                tokenEst: Math.round(res.selection.length / 4),
              };
            } else {
              state.activeContext = state.ambientPage;
            }
          }
        }
      } catch (err) {

      }
    }
  }

  function listenToExternalContext() {
    if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.onChanged) {
      chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === "local" && changes.echogpt_active_context && changes.echogpt_active_context.newValue) {
          applyIncomingContextPayload(changes.echogpt_active_context.newValue);
        }
      });

      chrome.storage.local.get(["echogpt_active_context"], (res) => {
        if (res.echogpt_active_context && Date.now() - (res.echogpt_active_context.timestamp || 0) < 60000) {
          applyIncomingContextPayload(res.echogpt_active_context);
        }
      });
    }
  }

  function applyIncomingContextPayload(payload) {
    if (!payload) return;
    if (payload.selectionText) {
      state.activeContext = {
        type: "selection",
        text: payload.selectionText,
        sourceTitle: payload.pageTitle || "Webpage",
        url: payload.pageUrl || "",
        domain: payload.pageUrl ? new URL(payload.pageUrl).hostname.replace("www.", "") : "active tab",
        wordCount: payload.selectionText.split(/\s+/).length,
        tokenEst: Math.round(payload.selectionText.length / 4),
      };
    } else {
      state.activeContext = {
        type: "page",
        title: payload.pageTitle || "Active Webpage",
        url: payload.pageUrl || "",
        domain: payload.pageUrl ? new URL(payload.pageUrl).hostname.replace("www.", "") : "active tab",
        text: "Clean page DOM content extracted.",
        tokenEst: 150,
      };
    }

    renderContextHeroCard();
    renderComposerContextIndicator();

    if (payload.action === "echogpt-summarize") {
      handleContextAction("summarize");
    } else if (payload.action === "echogpt-explain") {
      handleContextAction("explain");
    } else if (payload.action === "echogpt-rewrite") {
      handleContextAction("rewrite");
    } else if (payload.action === "echogpt-page-summary") {
      handleContextAction("summarize");
    }
  }

  function renderContextHeroCard() {
    if (!contextHeroCard) return;

    if (state.activeContext && state.activeContext.type === "page") {
      contextHeroCard.innerHTML = `
        <div class="context-top-row">
          <div class="context-meta-group">
            <span class="context-category-badge">CURRENT PAGE</span>
            <span class="context-status-pill">
              <span class="context-pulse-dot"></span>
              <span>Context enabled</span>
            </span>
          </div>
          <div class="context-top-controls">
            <button type="button" class="context-btn-text" id="demoCycleBtn" title="Cycle through demo context types">⇄ Demo</button>
            <button type="button" class="context-btn-text danger" id="cardDetachBtn" title="Detach context">Detach</button>
          </div>
        </div>

        <div class="context-content-area">
          <div class="context-title-row">
            <span class="context-main-title">📄 ${escapeHtml(state.activeContext.title)}</span>
            <span class="context-domain-tag">${escapeHtml(state.activeContext.domain || "active tab")}</span>
          </div>
          <div class="context-subtext">
            <span>Grounding next query in full page content</span>
          </div>
        </div>

        <div class="context-actions-row">
          <button type="button" class="context-action-btn" data-action="summarize" title="Summarize active page">
            <span>⚡ Summarize</span>
          </button>
          <button type="button" class="context-action-btn" data-action="explain" title="Explain concepts on page">
            <span>💡 Explain</span>
          </button>
          <button type="button" class="context-action-btn" data-action="key-points" title="Extract top key points">
            <span>🎯 Key points</span>
          </button>
          <button type="button" class="context-action-btn" data-action="ask-page" title="Type a question about this page">
            <span>💬 Ask page</span>
          </button>
        </div>
      `;
    }
    // B. SELECTED TEXT CONTEXT
    else if (state.activeContext && state.activeContext.type === "selection") {
      const excerpt = state.activeContext.text;
      contextHeroCard.innerHTML = `
        <div class="context-top-row">
          <div class="context-meta-group">
            <span class="context-category-badge selection">SELECTED TEXT</span>
            <span class="context-status-pill" style="color:#38bdf8;">
              <span class="context-pulse-dot" style="background:#38bdf8;box-shadow:0 0 6px #38bdf8;"></span>
              <span>Selection active</span>
            </span>
          </div>
          <div class="context-top-controls">
            <button type="button" class="context-btn-text" id="demoCycleBtn" title="Cycle through demo context types">⇄ Demo</button>
            <button type="button" class="context-btn-text danger" id="cardDetachBtn" title="Detach context">Detach</button>
          </div>
        </div>

        <div class="context-content-area">
          <div class="context-excerpt-quote" id="cardQuoteExcerpt" title="Click to view full selection">
            &ldquo;${escapeHtml(excerpt)}&rdquo;
          </div>
          <div class="context-subtext">
            <span>From: ${escapeHtml(state.activeContext.sourceTitle || "Webpage")} (${escapeHtml(state.activeContext.domain || "react.dev")}) · ${state.activeContext.wordCount || 22} words</span>
          </div>
        </div>

        <div class="context-actions-row">
          <button type="button" class="context-action-btn" data-action="explain" title="Explain selected text">
            <span>💡 Explain</span>
          </button>
          <button type="button" class="context-action-btn" data-action="rewrite" title="Rewrite selected text">
            <span>✏️ Rewrite</span>
          </button>
          <button type="button" class="context-action-btn" data-action="translate" title="Translate selected text">
            <span>🌐 Translate</span>
          </button>
          <button type="button" class="context-action-btn" data-action="ask-selection" title="Ask a question about this selection">
            <span>💬 Ask about this</span>
          </button>
        </div>
      `;
    }
    // C. NO CONTEXT ATTACHED
    else {
      contextHeroCard.innerHTML = `
        <div class="context-empty-card">
          <div style="display:flex;align-items:center;gap:6px;color:var(--text-muted);font-size:11px;">
            <span style="opacity:0.6;">○</span>
            <span>No active context attached</span>
          </div>
          <div style="display:flex;gap:6px;">
            <button type="button" class="context-btn-small" id="cardAttachPageBtn">+ Attach Page</button>
            <button type="button" class="context-btn-text" id="demoCycleBtn" title="Cycle demo context">⇄ Demo</button>
          </div>
        </div>
      `;
    }

    // Attach card event listeners
    const detachBtn = contextHeroCard.querySelector("#cardDetachBtn");
    if (detachBtn) {
      detachBtn.addEventListener("click", detachContext);
    }

    const attachPageBtn = contextHeroCard.querySelector("#cardAttachPageBtn");
    if (attachPageBtn) {
      attachPageBtn.addEventListener("click", () => {
        state.activeContext = state.ambientPage || PRESET_CONTEXTS.page;
        renderContextHeroCard();
        renderComposerContextIndicator();
      });
    }

    const demoCycleBtn = contextHeroCard.querySelector("#demoCycleBtn");
    if (demoCycleBtn) {
      demoCycleBtn.addEventListener("click", cycleNextDemoContext);
    }

    const quoteExcerpt = contextHeroCard.querySelector("#cardQuoteExcerpt");
    if (quoteExcerpt) {
      quoteExcerpt.addEventListener("click", openContextInspector);
    }

    contextHeroCard.querySelectorAll(".context-action-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-action");
        handleContextAction(action);
      });
    });
  }

  // ========================================================
  // 8. Render Composer Context Indicator
  // ========================================================
  function renderComposerContextIndicator() {
    if (!composerContextIndicator || !composerDetachedBanner) return;

    if (state.activeContext) {
      composerContextIndicator.style.display = "flex";
      composerDetachedBanner.style.display = "none";

      if (state.activeContext.type === "page") {
        composerCtxDot.style.backgroundColor = "var(--success)";
        composerCtxDot.style.boxShadow = "0 0 6px var(--success)";
        composerCtxIntent.textContent = "Will send with prompt";
        composerCtxSource.textContent = state.activeContext.domain || "react.dev";
        composerCtxLabel.textContent = `📄 ${state.activeContext.title}`;
        promptInput.placeholder = `Ask about ${state.activeContext.title.split(" ")[0]} or type anything...`;
      } else {
        composerCtxDot.style.backgroundColor = "#38bdf8";
        composerCtxDot.style.boxShadow = "0 0 6px #38bdf8";
        composerCtxIntent.textContent = "Will send with prompt";
        composerCtxSource.textContent = "Selected text";
        const shortSnippet = state.activeContext.text.slice(0, 24);
        composerCtxLabel.textContent = `✂️ "${shortSnippet}..."`;
        promptInput.placeholder = "Ask about this selection or select an action...";
      }
    } else {
      composerContextIndicator.style.display = "none";
      composerDetachedBanner.style.display = "flex";
      promptInput.placeholder = "Ask Claude anything, or attach context above...";
    }
  }

  // Detach Context from active prompt
  function detachContext() {
    state.activeContext = null;
    renderContextHeroCard();
    renderComposerContextIndicator();
    promptInput.focus();
  }

  // Cycle demo contexts for evaluation
  function cycleNextDemoContext() {
    if (!state.activeContext) {
      state.activeContext = PRESET_CONTEXTS.page;
    } else if (state.activeContext.type === "page") {
      state.activeContext = PRESET_CONTEXTS.selection1;
    } else if (state.activeContext === PRESET_CONTEXTS.selection1) {
      state.activeContext = PRESET_CONTEXTS.selection2;
    } else {
      state.activeContext = null;
    }
    renderContextHeroCard();
    renderComposerContextIndicator();
  }

  // Handle Context Action Clicks
  function handleContextAction(action) {
    if (!state.activeContext) {
      state.activeContext = PRESET_CONTEXTS.page;
      renderContextHeroCard();
      renderComposerContextIndicator();
    }

    // A. Page Actions
    if (action === "summarize") {
      handleSendMessage("Summarize the key architectural takeaways and concepts of this page.");
    } else if (action === "explain") {
      if (state.activeContext.type === "selection") {
        handleSendMessage(`Explain this selected statement in simple terms:\n\n"${state.activeContext.text}"`);
      } else {
        handleSendMessage("Explain what this page covers and its core mental model.");
      }
    } else if (action === "key-points") {
      handleSendMessage("Extract the top 4 actionable takeaways and principles from this page.");
    } else if (action === "ask-page") {
      promptInput.value = `Regarding ${state.activeContext.title}: `;
      promptInput.focus();
      promptInput.setSelectionRange(promptInput.value.length, promptInput.value.length);
    }
    // B. Selection Actions
    else if (action === "rewrite") {
      handleSendMessage(`Rewrite this selected text into 3 variations (Concise, Technical, Professional):\n\n"${state.activeContext.text}"`);
    } else if (action === "translate") {
      handleSendMessage(`Translate this selected text into Spanish, French, and Japanese with terminology notes:\n\n"${state.activeContext.text}"`);
    } else if (action === "ask-selection") {
      const shortSnippet = state.activeContext.text.slice(0, 26);
      promptInput.value = `About this selection ("${shortSnippet}..."): `;
      promptInput.focus();
      promptInput.setSelectionRange(promptInput.value.length, promptInput.value.length);
    }
  }

  // Progressive Disclosure: Open Inspector Drawer
  function openContextInspector() {
    if (!state.activeContext) return;
    closeAllPanels();

    if (state.activeContext.type === "page") {
      inspectMetaTag.textContent = "CURRENT PAGE CONTEXT";
      inspectMetaTag.style.color = "var(--primary)";
      inspectMetaTitle.textContent = state.activeContext.title;
      inspectMetaUrl.textContent = state.activeContext.url;
      inspectFullTextBox.textContent = state.activeContext.text;
      inspectTokenStat.innerHTML = `<span class="status-dot"></span><span>Active in prompt (~${state.activeContext.tokenEst || 140} tokens)</span>`;
    } else {
      inspectMetaTag.textContent = "SELECTED TEXT CONTEXT";
      inspectMetaTag.style.color = "#38bdf8";
      inspectMetaTitle.textContent = `Selection (${state.activeContext.wordCount || 22} words)`;
      inspectMetaUrl.textContent = `From: ${state.activeContext.sourceTitle} (${state.activeContext.url})`;
      inspectFullTextBox.textContent = `"${state.activeContext.text}"`;
      inspectTokenStat.innerHTML = `<span class="status-dot" style="background:#38bdf8;"></span><span>Active in prompt (~${state.activeContext.tokenEst || 35} tokens)</span>`;
    }

    contextInspectPanel.classList.add("open");
  }

  // ========================================================
  // 9. Chat Canvas & Mock AI Response Generation
  // ========================================================
  function renderChatCanvas() {
    chatCanvas.innerHTML = "";
    const activeChat = state.conversations.find((c) => c.id === state.activeChatId);

    // Empty state
    if (!activeChat || activeChat.messages.length === 0) {
      const activeModel = EXTENSION_MODELS.find((m) => m.slug === state.activeModelSlug) || EXTENSION_MODELS[0];
      const emptyDiv = document.createElement("div");
      emptyDiv.className = "empty-state";
      emptyDiv.innerHTML = `
        <div style="width:40px;height:40px;border-radius:12px;background:var(--primary-subtle);color:var(--primary);display:inline-flex;align-items:center;justify-content:center;margin:auto;">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
        </div>
        <div class="empty-title">EchoGPT Side Panel</div>
        <div class="empty-desc">Context-aware productivity with ${activeModel.title}. Choose an action or prompt below:</div>

        <div class="starter-card" data-prompt="Summarize the core concepts and architecture on this page.">
          <strong>📑 Summarize Page</strong>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">Extract core takeaways into bullet points</div>
        </div>
        <div class="starter-card" data-prompt="Explain the technical concepts on this page step-by-step with analogies.">
          <strong>💡 Explain Concepts</strong>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">Step-by-step breakdown for fast learning</div>
        </div>
        <div class="starter-card" data-prompt="Generate a clean TypeScript code implementation based on this page.">
          <strong>💻 Code Snippet</strong>
          <div style="font-size:10.5px;color:var(--text-muted);margin-top:2px;">Production-ready type-safe implementation</div>
        </div>
      `;

      emptyDiv.querySelectorAll(".starter-card").forEach((card) => {
        card.addEventListener("click", () => {
          promptInput.value = card.getAttribute("data-prompt") || "";
          promptInput.focus();
          handleSendMessage();
        });
      });

      chatCanvas.appendChild(emptyDiv);
      return;
    }

    // Render turn messages
    activeChat.messages.forEach((msg) => {
      const bubble = document.createElement("div");
      bubble.className = `message-bubble ${msg.role}`;

      if (msg.role === "user") {
        bubble.textContent = msg.content;
      } else {
        let html = `
          <div class="assistant-meta">
            <span class="assistant-name">${msg.modelTitle || "EchoGPT"}</span>
            <span>Just now</span>
          </div>
        `;

        if (msg.reasoning) {
          html += `
            <div class="reasoning-box">
              <div class="reasoning-header">
                <span>🧠 Thinking Process</span>
              </div>
              <div style="white-space: pre-wrap; font-size: 10px; line-height: 1.4;">${escapeHtml(msg.reasoning)}</div>
            </div>
          `;
        }

        html += formatMarkdown(msg.content);

        html += `
          <div class="assistant-footer">
            <div class="action-row">
              <button type="button" class="action-icon copy-msg-btn" data-text="${encodeURIComponent(msg.content)}" title="Copy message">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
              </button>
              <button type="button" class="action-icon like-btn" title="Helpful">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
              </button>
            </div>
            <span style="font-size: 9.5px; font-family: var(--font-mono); color: var(--text-muted);">380 tok</span>
          </div>
        `;

        bubble.innerHTML = html;
      }

      chatCanvas.appendChild(bubble);
    });

    chatCanvas.querySelectorAll(".copy-msg-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const text = decodeURIComponent(btn.getAttribute("data-text") || "");
        navigator.clipboard.writeText(text);
        btn.innerHTML = `<span style="color:var(--success);font-size:10px;font-weight:600;">Copied</span>`;
        setTimeout(() => {
          btn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>`;
        }, 1500);
      });
    });

    chatCanvas.scrollTop = chatCanvas.scrollHeight;
  }

  // Format basic markdown and code fences
  function formatMarkdown(text) {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts
      .map((part) => {
        if (part.startsWith("```") && part.endsWith("```")) {
          const lines = part.slice(3, -3).trim().split("\n");
          const lang = lines[0].includes(" ") ? "code" : lines[0] || "code";
          const code = lines[0].includes(" ") ? lines.join("\n") : lines.slice(1).join("\n");
          return `
            <div class="code-block-container" style="margin:6px 0;">
              <div class="code-header">
                <span style="text-transform:uppercase;font-weight:bold;">${escapeHtml(lang)}</span>
              </div>
              <pre><code>${escapeHtml(code)}</code></pre>
            </div>
          `;
        }
        return `<div>${escapeHtml(part).replace(/\n\n/g, "<br><br>").replace(/\n/g, "<br>")}</div>`;
      })
      .join("");
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Send message with simulated AI generation
  function handleSendMessage(customPrompt) {
    const text = (customPrompt !== undefined ? customPrompt : promptInput.value).trim();
    if (!text || state.isGenerating) return;

    if (text.toLowerCase() === "/error" || text.toLowerCase() === "test error") {
      promptInput.value = "";
      errorBanner.style.display = "flex";
      errorMessage.textContent = "Model gateway timeout: Upstream provider failed to respond. (504 Gateway Timeout)";
      return;
    }

    let targetChat = state.conversations.find((c) => c.id === state.activeChatId);
    if (!targetChat) {
      targetChat = {
        id: `chat-${Date.now()}`,
        title: text.slice(0, 30) + (text.length > 30 ? "..." : ""),
        modelSlug: state.activeModelSlug,
        date: "Today",
        messages: [],
      };
      state.conversations.unshift(targetChat);
      state.activeChatId = targetChat.id;
    }

    // Attach Context metadata if present
    let finalPrompt = text;
    if (state.activeContext) {
      if (state.activeContext.type === "page") {
        finalPrompt = `[Context: Page "${state.activeContext.title}" (${state.activeContext.domain})]\n\n${text}`;
      } else {
        finalPrompt = `[Context: Selected Text "${state.activeContext.text.slice(0, 36)}..."]\n\n${text}`;
      }
    }

    targetChat.messages.push({
      role: "user",
      content: finalPrompt,
    });

    promptInput.value = "";
    promptInput.style.height = "40px";
    sendBtn.disabled = true;
    state.isGenerating = true;
    renderChatCanvas();

    // Show temporary streaming bubble
    const streamingBubble = document.createElement("div");
    streamingBubble.className = "message-bubble assistant";
    streamingBubble.id = "streamingBubble";
    const activeModel = EXTENSION_MODELS.find((m) => m.slug === state.activeModelSlug) || EXTENSION_MODELS[0];
    streamingBubble.innerHTML = `
      <div class="assistant-meta">
        <span class="assistant-name">${activeModel.title}</span>
        <span style="color:var(--primary);font-size:10px;">Generating...</span>
      </div>
      <div id="streamingText" style="white-space:pre-wrap;">Thinking...</div>
    `;
    chatCanvas.appendChild(streamingBubble);
    chatCanvas.scrollTop = chatCanvas.scrollHeight;

    setTimeout(() => {
      const responseTemplate = generateMockResponse(text, activeModel, state.activeContext);
      const textContainer = document.getElementById("streamingText");

      let currentWords = "";
      const words = responseTemplate.content.split(" ");
      let i = 0;

      const interval = setInterval(() => {
        if (i < words.length) {
          currentWords += (i > 0 ? " " : "") + words[i];
          if (textContainer) textContainer.innerHTML = formatMarkdown(currentWords);
          chatCanvas.scrollTop = chatCanvas.scrollHeight;
          i++;
        } else {
          clearInterval(interval);
          state.isGenerating = false;

          targetChat.messages.push({
            role: "assistant",
            modelTitle: activeModel.title,
            reasoning: responseTemplate.reasoning,
            content: responseTemplate.content,
          });

          if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ echogpt_chats: state.conversations });
          }

          renderChatCanvas();
        }
      }, 18);
    }, 250);
  }

  // Realistic AI responses reflecting the exact attached context
  function generateMockResponse(prompt, model, context) {
    const lower = prompt.toLowerCase();

    // A. Summarize
    if (lower.includes("summarize") || lower.includes("takeaway")) {
      return {
        content: `### Executive Summary of ${context?.title || "Active Page"}\n\n- **Core Philosophy**: UI is rendered as a pure function of component state.\n- **Component Hierarchy**: Small, focused components compose into full enterprise applications.\n- **Zero-Clutter Side Panel**: EchoGPT grounds this summary directly from your active browser tab (${context?.domain || "react.dev"}).`,
        reasoning: model.slug.includes("r1") ? "1. Extracted top invariants from page DOM.\n2. Formatted 3 actionable executive takeaways." : undefined,
      };
    }

    // B. Rewrite
    if (lower.includes("rewrite")) {
      return {
        content: `Here are 3 refined variations of your selected text:\n\n1. **Executive / Concise**:\n> "React enables modular, component-driven user interface engineering for web and native."\n\n2. **Technical / Architecture**:\n> "React decomposes UI state into composable JavaScript functions, streaming updates through a virtual DOM."\n\n3. **Engaging / High Impact**:\n> "Build modern applications like LEGO: combine reactive JavaScript components into stunning web experiences."`,
        reasoning: model.slug.includes("r1") ? "1. Analyzed original text semantics.\n2. Synthesized Concise, Technical, and Engaging registers." : undefined,
      };
    }

    // C. Translate
    if (lower.includes("translate")) {
      return {
        content: `Here is the translation of your selected snippet:\n\n- **Spanish**: *"React es una biblioteca de JavaScript para interfaces de usuario web y nativas."*\n- **French**: *"React est une bibliothèque JavaScript pour les interfaces utilisateur web et natives."*\n- **Japanese**: *「Reactは、Webおよびネイティブのユーザーインターフェースを構築するためのJavaScriptライブラリです。」*`,
        reasoning: model.slug.includes("r1") ? "1. Preserved technical terminology ('JavaScript', 'native', 'library').\n2. Verified grammatical concordance across target languages." : undefined,
      };
    }

    // D. Key Points
    if (lower.includes("key point") || lower.includes("key-point")) {
      return {
        content: `### Key Takeaways from ${context?.title || "Page"}\n\n1. **Component Isolation**: Each component manages its own state and markup.\n2. **Predictable State Flow**: Data flows unidirectionally from parent to child via props.\n3. **Modern React Ecosystem**: React Server Components optimize client bundle overhead.\n4. **Context-Aware Productivity**: Zero manual copy-pasting required when running in EchoGPT Side Panel.`,
      };
    }

    // E. General contextual inquiry
    return {
      content: `I analyzed your inquiry grounded in **${context?.title || context?.sourceTitle || "Active Context"}** using **${model.title}**:\n\n- **Context Grounding**: Verified against active browser DOM.\n- **Synthesis**: Key principles applied directly to your query.\n- **Latency**: Streamed in under 280ms inside Chrome Side Panel.`,
      reasoning: model.slug.includes("r1") ? "1. Grounded against active context payload.\n2. Verified model parameters and synthesized answer." : undefined,
    };
  }

  // Render Models List
  function renderModelList() {
    modelListContainer.innerHTML = "";
    EXTENSION_MODELS.forEach((m) => {
      const div = document.createElement("div");
      div.className = `model-option ${m.slug === state.activeModelSlug ? "active" : ""}`;
      div.innerHTML = `
        <div>
          <div style="font-weight:bold;font-size:12px;">${m.title}</div>
          <div style="font-size:10px;color:var(--text-muted);">${m.provider} · ${m.tag}</div>
        </div>
        ${m.slug === state.activeModelSlug ? '<span style="color:var(--primary);font-size:12px;font-weight:bold;">✓</span>' : ""}
      `;
      div.addEventListener("click", () => {
        state.activeModelSlug = m.slug;
        localStorage.setItem("echogpt_ext_model", m.slug);
        if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
          chrome.storage.local.set({ echogpt_model: m.slug });
        }
        updateActiveModelLabel();
        closeAllPanels();
        renderChatCanvas();
      });
      modelListContainer.appendChild(div);
    });
  }

  // Render History
  function renderHistoryList() {
    historyListContainer.innerHTML = "";
    const filtered = state.conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(state.historySearch.toLowerCase()) ||
        c.modelSlug.toLowerCase().includes(state.historySearch.toLowerCase())
    );

    if (filtered.length === 0) {
      historyListContainer.innerHTML = `<div style="text-align:center;color:var(--text-muted);padding:24px;font-size:11px;">No chats found.</div>`;
      return;
    }

    filtered.forEach((chat) => {
      const item = document.createElement("div");
      item.className = "history-item";
      item.innerHTML = `
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-right:8px;">
          <div style="font-weight:600;">${escapeHtml(chat.title)}</div>
          <div style="font-size:9.5px;color:var(--text-muted);">${chat.date}</div>
        </div>
        <button type="button" class="action-icon del-chat-btn" title="Delete chat">✕</button>
      `;

      item.addEventListener("click", (e) => {
        if (e.target.classList.contains("del-chat-btn")) {
          e.stopPropagation();
          state.conversations = state.conversations.filter((c) => c.id !== chat.id);
          if (state.activeChatId === chat.id) {
            state.activeChatId = state.conversations[0]?.id || null;
          }
          if (typeof chrome !== "undefined" && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ echogpt_chats: state.conversations });
          }
          renderHistoryList();
          renderChatCanvas();
          return;
        }

        state.activeChatId = chat.id;
        closeAllPanels();
        renderChatCanvas();
      });

      historyListContainer.appendChild(item);
    });
  }

  function closeAllPanels() {
    modelPanel.classList.remove("open");
    historyPanel.classList.remove("open");
    settingsPanel.classList.remove("open");
    contextInspectPanel.classList.remove("open");
  }

  // ========================================================
  // 10. Event Listeners Setup
  // ========================================================
  function setupEventListeners() {
    promptInput.addEventListener("input", () => {
      promptInput.style.height = "auto";
      promptInput.style.height = `${Math.min(Math.max(promptInput.scrollHeight, 40), 120)}px`;
      sendBtn.disabled = !promptInput.value.trim() || state.isGenerating;
    });

    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    });

    sendBtn.addEventListener("click", () => handleSendMessage());

    newChatBtn.addEventListener("click", () => {
      state.activeChatId = null;
      closeAllPanels();
      renderChatCanvas();
      promptInput.focus();
    });

    themeToggleBtn.addEventListener("click", () => {
      setTheme(state.theme === "dark" ? "light" : "dark");
    });

    modelPillBtn.addEventListener("click", () => {
      renderModelList();
      modelPanel.classList.toggle("open");
      historyPanel.classList.remove("open");
      settingsPanel.classList.remove("open");
      contextInspectPanel.classList.remove("open");
    });

    historyBtn.addEventListener("click", () => {
      renderHistoryList();
      historyPanel.classList.toggle("open");
      modelPanel.classList.remove("open");
      settingsPanel.classList.remove("open");
      contextInspectPanel.classList.remove("open");
    });

    settingsBtn.addEventListener("click", () => {
      settingsPanel.classList.toggle("open");
      modelPanel.classList.remove("open");
      historyPanel.classList.remove("open");
      contextInspectPanel.classList.remove("open");
    });

    closeModelPanelBtn.addEventListener("click", closeAllPanels);
    closeHistoryPanelBtn.addEventListener("click", closeAllPanels);
    closeSettingsPanelBtn.addEventListener("click", closeAllPanels);
    closeInspectPanelBtn.addEventListener("click", closeAllPanels);

    // Composer context indicator controls
    composerCtxRemoveBtn.addEventListener("click", detachContext);
    composerCtxInspectBtn.addEventListener("click", openContextInspector);
    composerQuickAttachBtn.addEventListener("click", () => {
      state.activeContext = state.ambientPage || PRESET_CONTEXTS.page;
      renderContextHeroCard();
      renderComposerContextIndicator();
    });

    inspectDetachBtn.addEventListener("click", () => {
      detachContext();
      closeAllPanels();
    });

    // History search
    historySearchInput.addEventListener("input", (e) => {
      state.historySearch = e.target.value;
      renderHistoryList();
    });

    // Settings Theme Buttons
    themeDarkBtn.addEventListener("click", () => setTheme("dark"));
    themeLightBtn.addEventListener("click", () => setTheme("light"));

    // Demo Context Switching buttons in settings
    document.querySelectorAll(".demo-ctx-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const type = btn.getAttribute("data-ctx");
        if (type === "page") state.activeContext = PRESET_CONTEXTS.page;
        else if (type === "selection1") state.activeContext = PRESET_CONTEXTS.selection1;
        else if (type === "selection2") state.activeContext = PRESET_CONTEXTS.selection2;
        else state.activeContext = null;

        renderContextHeroCard();
        renderComposerContextIndicator();
        closeAllPanels();
      });
    });

    if (autoContextCheckbox) {
      autoContextCheckbox.addEventListener("change", (e) => {
        state.autoContextEnabled = e.target.checked;
        if (!state.autoContextEnabled && state.activeContext?.type === "page") {
          detachContext();
        }
      });
    }

    if (autoSelectionCheckbox) {
      autoSelectionCheckbox.addEventListener("change", (e) => {
        state.autoSelectionEnabled = e.target.checked;
      });
    }

    retryErrorBtn.addEventListener("click", () => {
      errorBanner.style.display = "none";
      handleSendMessage("Please retry previous instruction.");
    });

    // Escape closes all open panels
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeAllPanels();
    });
  }

  // Start extension side panel
  init();
})();
