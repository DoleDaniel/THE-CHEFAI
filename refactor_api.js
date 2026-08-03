const fs = require('fs');
const path = require('path');

// 1. Process index.html
let indexHtml = fs.readFileSync('index.html', 'utf8');

// Remove the youtube-api-modal block
const modalStart = indexHtml.indexOf('<!-- MODAL: YOUTUBE API KEY CONFIGURATION -->');
if (modalStart !== -1) {
  const nextModal = indexHtml.indexOf('<!-- MODAL: RECIPE DETAIL -->', modalStart);
  if (nextModal !== -1) {
    indexHtml = indexHtml.substring(0, modalStart) + indexHtml.substring(nextModal);
  }
}
fs.writeFileSync('index.html', indexHtml, 'utf8');
console.log('Updated index.html');

// 2. Process app.js
let appJs = fs.readFileSync('app.js', 'utf8');

// Remove youtubeApiKey from state
appJs = appJs.replace(/youtubeApiKey:.*?,/g, '');

// Remove setupYoutubeApiKeyModal and checkBackendYoutubeKey calls
appJs = appJs.replace(/setupYoutubeApiKeyModal\(\);/g, '');
appJs = appJs.replace(/checkBackendYoutubeKey\(\);/g, '');

// Remove checkBackendYoutubeKey function
const checkBackendRegex = /async function checkBackendYoutubeKey\(\) \{[\s\S]*?\}\s*\}\s*\}\s*catch[^\}]+\}\s*\}/;
appJs = appJs.replace(checkBackendRegex, '');

// Remove setupYoutubeApiKeyModal function
const setupModalRegex = /function setupYoutubeApiKeyModal\(\) \{[\s\S]*?\}\s*\n/g;
appJs = appJs.replace(setupModalRegex, '');

// Replace state.youtubeApiKey usages in fetch calls
appJs = appJs.replace(/state\.youtubeApiKey/g, '""');

// Remove "else if (state.youtubeApiKey)" conditionally, turn it into "else"
appJs = appJs.replace(/else if \("" \)/g, 'else');

fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Updated app.js');

// 3. Process youtubeService.js
let ytJs = fs.readFileSync('youtubeService.js', 'utf8');

// Just to be absolutely sure, it already proxies properly, 
// so we don't strictly need to modify youtubeService.js as it uses window.API_BASE_URL.
// But we can remove the fallback "else" logic if it relies on client key?
// Actually, it doesn't matter, passing "" for apiKey is enough.

fs.writeFileSync('youtubeService.js', ytJs, 'utf8');
console.log('Updated youtubeService.js');
