# EchoGPT Chrome Extension — Side Panel (Manifest V3)

A dedicated, context-aware productivity companion built specifically for the **Chrome Side Panel** API.

Unlike legacy browser extensions that attempted to squeeze full desktop web applications into narrow viewports or injected invasive DOM overlays onto every tab, EchoGPT v2.0 is engineered specifically for Chrome's native Side Panel API, optimized for widths between **300px and 500px**.

---

## Architecture & Directory Structure

```
extension/
├── manifest.json       # Manifest V3 specification
├── background.js       # Service worker (panel behavior, context menus, message routing)
├── content.js          # On-demand DOM reader for active tab grounding
├── sidepanel.html      # Semantic HTML structure for the side panel interface
├── sidepanel.css       # Obsidian Dark & Lilac Light styling (300px–500px responsive)
├── sidepanel.js        # Model switching, token streaming, context grounding, storage
├── icons/              # Multi-resolution raster and vector icons
│   ├── icon16.png
│   ├── icon48.png
│   ├── icon128.png
│   └── logo.svg
└── README.md           # Technical documentation and permission audit
```

---

## Permissions Audit & Documentation

In alignment with Chrome Web Store best practices and user privacy guarantees, **EchoGPT v2.0 eliminates all broad, intrusive permissions** that existed in legacy AI extensions.

### Requested Permissions & Justifications

| Permission | Category | Why It Is Required | Why Alternatives Were Rejected |
| :--- | :--- | :--- | :--- |
| `sidePanel` | Chrome API | Enables opening and managing the native Chrome Side Panel window (`sidepanel.html`) alongside regular browsing tabs. | Popups close automatically whenever the user clicks back onto the page. The Side Panel stays persistent, allowing simultaneous reading and querying. |
| `activeTab` | Temporary Tab Access | Grants temporary, explicit read access to the currently active browser tab **only when the user invokes the extension** (via toolbar icon click, context menu, or keyboard shortcut). | Avoids `<all_urls>` or `*://*/*`. The extension has zero visibility into tabs you are not actively viewing or interacting with. |
| `storage` | Storage API | Persists user preferences locally (dark/light theme, active AI model, recent side panel chats) using `chrome.storage.local`. | Avoids reliance on third-party cookies or intrusive remote session trackers. Keeps chat history confidential on device. |
| `contextMenus` | Context Menus | Registers right-click menu items (*"EchoGPT: Summarize Selection"*, *"Explain Selection"*, *"Rewrite Selection"*) to send highlighted browser text directly into the side panel. | Without `contextMenus`, users would be forced to manually copy, switch focus to the panel, paste, and type their prompt. |
| `scripting` | Programmatic Execution | Allows programmatic extraction of the active tab's title, URL, clean body text, and selected text on demand when the user clicks *"Attach Page"* or *"Attach Selection"*. | Eliminates the need for persistent content scripts injected into every page lifecycle, significantly reducing RAM usage and eliminating page latency. |

### Permissions Explicitly Avoided

* ❌ **`<all_urls>` / `http://*/*` / `https://*/*`**: Legacy extensions requested access to all websites, triggering Chrome's warning *"This extension can read and change all your data on websites you visit"*. EchoGPT v2.0 uses `activeTab`, meaning no site data is accessible unless you explicitly interact with the side panel.
* ❌ **`cookies`**: No cross-site cookie inspection. Authentication and preferences are isolated.
* ❌ **`webRequest` / `declarativeNetRequest`**: No interception of network traffic or browser requests.
* ❌ **`tabs` (broad)**: Replaced by scoped `activeTab`. EchoGPT cannot enumerate, inspect, or track background tabs.

---

## Key Features

1. **Native Side Panel Integration**: Persistent side panel alongside any website with zero layout shifting.
2. **Context-Aware Grounding**:
   - **Page Mode**: Extracts the active article/documentation text, stripping ads and navigation chrome.
   - **Selection Mode**: Captures highlighted sentences for instant explanation or translation.
3. **Multi-Model Intelligence**: Switch between **Claude 3.5 Sonnet**, **DeepSeek R1** (with reasoning traces), **GPT-4o**, **Gemini 1.5 Pro**, and **Llama 3.3 70B** in two clicks.
4. **Quick Actions Row**: 1-click prompt dispatch for *Summarize*, *Explain*, *Key Points*, *Rewrite*, and *Code*.
5. **Narrow-Width Responsive Architecture**:
   - Tested down to **300px** without horizontal scrollbars.
   - Slide-out overlay drawers for Models, Conversation History, and Settings.
   - Resizable composer with shortcut hints.
6. **Obsidian Dark & Lilac Light Themes**: Full visual parity with the EchoGPT web workspace.

---

## Keyboard Shortcuts

- <kbd>Alt</kbd> + <kbd>E</kbd> (Mac: <kbd>Option</kbd> + <kbd>E</kbd>): Toggle EchoGPT Side Panel open/closed.
- <kbd>Enter</kbd>: Send prompt to active AI model.
- <kbd>Shift</kbd> + <kbd>Enter</kbd>: Add a newline in prompt composer.
- <kbd>Escape</kbd>: Dismiss open model selector, history, or settings drawer.

---

## How to Install & Load (Developer / Unpacked Mode)

1. Open Google Chrome (v116+ recommended for full Side Panel API support).
2. Navigate to `chrome://extensions/`.
3. Enable **Developer mode** toggle in the top-right corner.
4. Click **Load unpacked**.
5. Select the `extension/` folder inside this repository:
   ```
   E:\Study\EchoGPT Frontend\extension
   ```
6. The **EchoGPT - Multi-AI Chrome Side Panel** icon will appear in your extensions toolbar.
7. Click the extension icon or press <kbd>Alt</kbd> + <kbd>E</kbd> to open the side panel.
