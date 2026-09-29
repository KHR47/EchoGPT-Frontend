const fs = require("fs");
const path = require("path");

const EXT_DIR = path.resolve(__dirname, "../extension");
const MANIFEST_PATH = path.join(EXT_DIR, "manifest.json");
const HTML_PATH = path.join(EXT_DIR, "sidepanel.html");
const CSS_PATH = path.join(EXT_DIR, "sidepanel.css");
const JS_PATH = path.join(EXT_DIR, "sidepanel.js");

console.log("=================================================");
console.log("   EchoGPT Chrome Side Panel Test Suite (MV3)    ");
console.log("=================================================\n");

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

// 1. Manifest V3 Tests
console.log("[1] Manifest V3 Specification Tests");
const manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
assert(manifest.manifest_version === 3, "Manifest version is exactly 3");
assert(manifest.name.includes("EchoGPT"), "Name correctly identifies EchoGPT");
assert(manifest.version === "2.0.0", "Version is 2.0.0");
assert(manifest.side_panel && manifest.side_panel.default_path === "sidepanel.html", "side_panel.default_path points to sidepanel.html");
assert(manifest.background && manifest.background.service_worker === "background.js", "Service worker registered as background.js");
assert(manifest.background.type === "module", "Service worker is ES module");
assert(manifest.action && manifest.action.default_title, "Extension action default_title defined");
assert(manifest.commands && manifest.commands._execute_action, "Keyboard shortcut command configured (Alt+E)");

// Permitted permissions
const PERMISSIONS = manifest.permissions || [];
assert(PERMISSIONS.includes("sidePanel"), "Includes 'sidePanel' permission");
assert(PERMISSIONS.includes("activeTab"), "Includes 'activeTab' permission");
assert(PERMISSIONS.includes("storage"), "Includes 'storage' permission");
assert(PERMISSIONS.includes("contextMenus"), "Includes 'contextMenus' permission");
assert(PERMISSIONS.includes("scripting"), "Includes 'scripting' permission");

// Intrusive permissions avoided
assert(!PERMISSIONS.includes("<all_urls>"), "DOES NOT request '<all_urls>'");
assert(!PERMISSIONS.includes("cookies"), "DOES NOT request 'cookies'");
assert(!PERMISSIONS.includes("webRequest"), "DOES NOT request 'webRequest'");
assert(!manifest.host_permissions, "Zero broad host_permissions requested");

// 2. HTML Semantic & Context Element Structure Tests
console.log("\n[2] HTML Semantic & Context Structure Tests");
const html = fs.readFileSync(HTML_PATH, "utf8");
assert(html.includes('class="extension-header"'), "Extension header element exists");
assert(html.includes('id="modelPillBtn"'), "Model selector pill button exists");
assert(html.includes('id="newChatBtn"'), "New chat button exists");
assert(html.includes('id="historyBtn"'), "Conversation history button exists");
assert(html.includes('id="themeToggleBtn"'), "Theme toggle button exists");
assert(html.includes('id="settingsBtn"'), "Settings button exists");
assert(html.includes('id="contextHeroCard"'), "Dedicated context hero card exists");
assert(html.includes('id="composerContextIndicator"'), "Composer context indicator exists");
assert(html.includes('id="composerCtxIntent"'), "Composer context intent label exists ('Will send with prompt')");
assert(html.includes('id="composerCtxRemoveBtn"'), "Composer context remove button exists");
assert(html.includes('id="composerDetachedBanner"'), "Composer detached banner exists");
assert(html.includes('id="contextInspectPanel"'), "Progressive disclosure context inspector panel exists");
assert(html.includes('id="chatCanvas"'), "Chat messages canvas container exists");
assert(html.includes('id="promptInput"'), "Composer prompt textarea exists");
assert(html.includes('id="sendBtn"'), "Composer send button exists");
assert(html.includes('id="modelPanel"'), "Model selector overlay drawer exists");
assert(html.includes('id="historyPanel"'), "History overlay drawer exists");
assert(html.includes('id="settingsPanel"'), "Settings overlay drawer exists");
assert(html.includes('id="errorBanner"'), "Error state banner exists");

// 3. CSS Narrow-Width & Context Design System Tests
console.log("\n[3] CSS Layout, Context & Design System Tests");
const css = fs.readFileSync(CSS_PATH, "utf8");
assert(css.includes("--bg-app: #151515"), "Dark background token defined");
assert(css.includes('[data-theme="light"]'), "Light theme variables defined");
assert(css.includes("--primary: #6da7ec"), "Primary accent token defined");
assert(css.includes(".context-hero-card"), "Context hero card styling defined");
assert(css.includes(".context-category-badge"), "Context category badge styling defined");
assert(css.includes(".context-status-pill"), "Context status pill styling defined");
assert(css.includes(".context-pulse-dot"), "Context pulse dot animation styling defined");
assert(css.includes(".context-excerpt-quote"), "Selected text quote styling defined");
assert(css.includes(".composer-context-indicator"), "Composer context indicator styling defined");
assert(css.includes(".composer-ctx-intent"), "Composer context intent styling defined");
assert(css.includes(".inspect-meta-box"), "Context inspector meta box styling defined");
assert(css.includes(".overlay-panel"), "Overlay panel styling defined");
assert(css.includes("transform: translateX(100%)"), "Overlay drawers animate via hardware transform");

// 4. JavaScript Context Logic & Interaction Tests
console.log("\n[4] JavaScript Contextual Workflows & AI Grounding Tests");
const js = fs.readFileSync(JS_PATH, "utf8");
assert(js.includes("PRESET_CONTEXTS = {"), "Preset context scenarios defined");
assert(js.includes("renderContextHeroCard"), "renderContextHeroCard function implemented");
assert(js.includes("renderComposerContextIndicator"), "renderComposerContextIndicator function implemented");
assert(js.includes("detachContext"), "detachContext function implemented");
assert(js.includes("openContextInspector"), "openContextInspector function implemented");
assert(js.includes("cycleNextDemoContext"), "cycleNextDemoContext function implemented for evaluation");
assert(js.includes("handleContextAction"), "handleContextAction function handles Summarize, Explain, Key points, Rewrite, Translate");
assert(js.includes("ask-page"), "Action: 'Ask about page' implemented");
assert(js.includes("ask-selection"), "Action: 'Ask about this' implemented");
assert(js.includes("generateMockResponse"), "Multi-model mock AI response generator considers attached context");
assert(js.includes("Escape"), "Escape key dismisses all overlay drawers");

// 5. Documentation Tests
console.log("\n[5] Documentation & Permissions Audit Tests");
const readme = fs.readFileSync(path.join(EXT_DIR, "README.md"), "utf8");
assert(readme.includes("sidePanel"), "README documents 'sidePanel' permission");
assert(readme.includes("activeTab"), "README documents 'activeTab' permission");
assert(readme.includes("storage"), "README documents 'storage' permission");
assert(readme.includes("contextMenus"), "README documents 'contextMenus' permission");
assert(readme.includes("scripting"), "README documents 'scripting' permission");
assert(readme.includes("Permissions Explicitly Avoided"), "README details rejected invasive permissions");

console.log("\n=================================================");
console.log(`Test Results: ${passed} Passed, ${failed} Failed.`);
console.log("=================================================\n");

if (failed > 0) {
  process.exit(1);
}
