const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);

// Remove "" = localStorage
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('"" = localStorage.getItem("the_chef_youtube_api_key")')) {
    lines[i] = '';
    console.log('Fixed line ' + i);
  }
}

function removeDoubleElse(startSearchLine) {
  let blockStart = -1;
  let blockEnd = -1;
  for (let i = startSearchLine; i < lines.length; i++) {
    if (lines[i].includes('} else {') && lines[i+1] && lines[i+1].includes('if (recipe.videoUrl) {')) {
      blockStart = i;
      break;
    }
    if (lines[i].includes('} else {') && lines[i+1] && lines[i+1].includes('const fallbackId = validateAndExtractVideoId')) {
      blockStart = i;
      break;
    }
  }

  if (blockStart !== -1) {
    let openBraces = 0;
    let foundFirstBrace = false;
    for (let j = blockStart; j < lines.length; j++) {
      if (lines[j].includes('{')) {
        openBraces += (lines[j].match(/\{/g) || []).length;
        foundFirstBrace = true;
      }
      if (lines[j].includes('}')) {
        openBraces -= (lines[j].match(/\}/g) || []).length;
      }
      if (foundFirstBrace && openBraces === 0) {
        blockEnd = j;
        break;
      }
    }
    if (blockEnd !== -1) {
      lines.splice(blockStart, blockEnd - blockStart + 1);
      console.log(`Removed double else block from ${blockStart} to ${blockEnd}`);
      return blockEnd; // return where to continue searching
    }
  }
  return -1;
}

let currLine = 0;
while (currLine !== -1 && currLine < lines.length) {
  let next = removeDoubleElse(currLine);
  if (next !== -1) currLine = next;
  else break;
}

fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
