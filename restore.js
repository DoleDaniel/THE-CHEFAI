const fs = require('fs');
const oldApp = fs.readFileSync('app_old.js', 'utf16le');
const currentApp = fs.readFileSync('app.js', 'utf8');

const startMarker = 'function setupEventListeners() {';
const endMarker = 'function setupCountryDropdown() {';

const startIdx = oldApp.indexOf(startMarker);
const endIdx = oldApp.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find boundaries in app_old.js");
  console.log("startIdx:", startIdx, "endIdx:", endIdx);
  process.exit(1);
}

const functionBody = oldApp.substring(startIdx, endIdx);

const insertTarget = 'function setupCountryDropdown() {';
const targetIdx = currentApp.indexOf(insertTarget);

if (targetIdx === -1) {
  console.log("Could not find target in app.js");
  process.exit(1);
}

const newApp = currentApp.substring(0, targetIdx) + functionBody + currentApp.substring(targetIdx);
fs.writeFileSync('app.js', newApp);
console.log("Successfully restored missing setup functions");
