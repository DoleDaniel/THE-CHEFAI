const fs = require('fs');

const oldApp = fs.readFileSync('app_old_utf8.js', 'utf8');
const currentApp = fs.readFileSync('app.js', 'utf8');

const startMarker = 'function setupEventListeners() {';
const endMarker = 'function getYoutubeThumbnail(recipe) {';

const startIdx = oldApp.indexOf(startMarker);
const endIdx = oldApp.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error("Could not find boundaries in old app.");
  process.exit(1);
}

const extractedCode = oldApp.substring(startIdx, endIdx);

const insertMarker = 'function setupCountryDropdown() {';
const insertIdx = currentApp.indexOf(insertMarker);

if (insertIdx === -1) {
  console.error("Could not find insert target in current app.");
  process.exit(1);
}

const newApp = currentApp.substring(0, insertIdx) + extractedCode + currentApp.substring(insertIdx);

fs.writeFileSync('app.js', newApp);
console.log("Restored missing functions successfully!");
