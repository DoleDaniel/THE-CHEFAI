const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);

// Find block 1
let block1Start = -1;
let block1End = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('} else {') && 
      lines[i+1] && lines[i+1].includes('if (recipe.videoUrl) {') &&
      lines[i+2] && lines[i+2].includes('const rawId = recipe.videoUrl;')) {
    block1Start = i;
    // Find end of this else block
    let openBraces = 0;
    for (let j = i; j < lines.length; j++) {
      if (lines[j].includes('{')) openBraces += (lines[j].match(/\{/g) || []).length;
      if (lines[j].includes('}')) openBraces -= (lines[j].match(/\}/g) || []).length;
      if (openBraces === 0) {
        block1End = j;
        break;
      }
    }
    break;
  }
}

if (block1Start !== -1 && block1End !== -1) {
  lines.splice(block1Start, block1End - block1Start + 1);
  console.log(`Removed block 1 from line ${block1Start} to ${block1End}`);
} else {
  console.log('Block 1 not found');
}

// Find block 2
let block2Start = -1;
let block2End = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('} else {') && 
      lines[i+1] && lines[i+1].includes('const fallbackId = validateAndExtractVideoId(recipe.videoUrl)') &&
      lines[i+2] && lines[i+2].includes('iframe.src = getCleanEmbedUrl')) {
    block2Start = i;
    let openBraces = 0;
    for (let j = i; j < lines.length; j++) {
      if (lines[j].includes('{')) openBraces += (lines[j].match(/\{/g) || []).length;
      if (lines[j].includes('}')) openBraces -= (lines[j].match(/\}/g) || []).length;
      if (openBraces === 0) {
        block2End = j;
        break;
      }
    }
    break;
  }
}

if (block2Start !== -1 && block2End !== -1) {
  lines.splice(block2Start, block2End - block2Start + 1);
  console.log(`Removed block 2 from line ${block2Start} to ${block2End}`);
} else {
  console.log('Block 2 not found');
}

fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
