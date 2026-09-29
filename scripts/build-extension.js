const fs = require("fs");
const path = require("path");

const EXTENSION_DIR = path.resolve(__dirname, "../extension");
const PUBLIC_EXT_DIR = path.resolve(__dirname, "../public/extension");
const DIST_DIR = path.resolve(__dirname, "../dist-extension");

console.log("==========================================");
console.log("EchoGPT Chrome Extension Validator & Build");
console.log("==========================================");

const manifestPath = path.join(EXTENSION_DIR, "manifest.json");
if (!fs.existsSync(manifestPath)) {
  console.error("❌ ERROR: manifest.json not found in extension directory!");
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  console.log("✅ manifest.json parsed successfully.");
} catch (err) {
  console.error("❌ ERROR: manifest.json is invalid JSON:", err);
  process.exit(1);
}

let errors = 0;
let warnings = 0;

if (manifest.manifest_version !== 3) {
  console.error(`❌ ERROR: manifest_version must be 3, found: ${manifest.manifest_version}`);
  errors++;
} else {
  console.log("✅ Manifest V3 version verified.");
}

// Check side panel config
if (!manifest.side_panel || !manifest.side_panel.default_path) {
  console.error("❌ ERROR: side_panel.default_path is required for Chrome Side Panel extensions!");
  errors++;
} else {
  const panelPath = path.join(EXTENSION_DIR, manifest.side_panel.default_path);
  if (!fs.existsSync(panelPath)) {
    console.error(`❌ ERROR: side_panel target file not found: ${manifest.side_panel.default_path}`);
    errors++;
  } else {
    console.log(`✅ Side panel target verified: ${manifest.side_panel.default_path}`);
  }
}

// Check background service worker
if (!manifest.background || !manifest.background.service_worker) {
  console.error("❌ ERROR: background.service_worker is required!");
  errors++;
} else {
  const workerPath = path.join(EXTENSION_DIR, manifest.background.service_worker);
  if (!fs.existsSync(workerPath)) {
    console.error(`❌ ERROR: background worker file not found: ${manifest.background.service_worker}`);
    errors++;
  } else {
    console.log(`✅ Background service worker verified: ${manifest.background.service_worker}`);
  }
}

// Check icons
const requiredIcons = [16, 48, 128];
for (const size of requiredIcons) {
  const iconRel = manifest.icons && manifest.icons[size.toString()];
  if (!iconRel || !fs.existsSync(path.join(EXTENSION_DIR, iconRel))) {
    console.error(`❌ ERROR: Icon for size ${size} missing: ${iconRel}`);
    errors++;
  }
}
console.log("✅ All required icon resolutions (16, 48, 128) verified.");

// 3. Security & Permission Audit
const FORBIDDEN_PERMISSIONS = ["<all_urls>", "cookies", "webRequest", "declarativeNetRequest", "management", "debugger"];
const requestedPermissions = manifest.permissions || [];

console.log("\n--- Permissions Audit ---");
for (const p of requestedPermissions) {
  if (FORBIDDEN_PERMISSIONS.includes(p)) {
    console.error(`❌ REJECTED: Forbidden intrusive permission detected: ${p}`);
    errors++;
  } else {
    console.log(`  ✓ Allowed minimal permission: "${p}"`);
  }
}

if (manifest.host_permissions && manifest.host_permissions.length > 0) {
  console.error("❌ ERROR: host_permissions should not be used when activeTab is sufficient!");
  errors++;
} else {
  console.log("✅ Zero intrusive host_permissions requested.");
}

// 4. Copy to public/extension for web app preview & tests
if (!fs.existsSync(PUBLIC_EXT_DIR)) {
  fs.mkdirSync(PUBLIC_EXT_DIR, { recursive: true });
}

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  if (isDirectory) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

copyRecursiveSync(EXTENSION_DIR, PUBLIC_EXT_DIR);
console.log(`✅ Synced extension files to ${PUBLIC_EXT_DIR} for web preview.`);

if (errors > 0) {
  console.error(`\n❌ BUILD FAILED: ${errors} errors found.`);
  process.exit(1);
}

console.log("\n==========================================");
console.log("🎉 Manifest V3 Validation Passed Successfully!");
console.log("Extension is ready for Chrome Side Panel usage.");
console.log("==========================================\n");
