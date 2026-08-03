const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);

// Remove the orphaned modal code (which starts with `// Close modal` after setupEventListeners)
let modalCodeStart = -1;
let modalCodeEnd = -1;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('// Close modal')) {
    modalCodeStart = i;
    break;
  }
}

// We know the modal code ends before `function setupCountryDropdown()`
if (modalCodeStart !== -1) {
  for (let i = modalCodeStart; i < lines.length; i++) {
    if (lines[i].includes('function setupCountryDropdown() {')) {
      modalCodeEnd = i - 1; // Delete up to the line before setupCountryDropdown
      break;
    }
  }
}

if (modalCodeStart !== -1 && modalCodeEnd !== -1) {
  lines.splice(modalCodeStart, modalCodeEnd - modalCodeStart + 1);
  console.log(`Deleted orphaned modal code from line ${modalCodeStart} to ${modalCodeEnd}`);
}

// Also remove `"" = keyVal;` if it's still somewhere else
for (let i = 0; i < lines.length; i++) {
  if (lines[i] && lines[i].includes('"" =')) {
    lines[i] = lines[i].replace(/"" =.*/g, '');
    console.log(`Cleaned LHS error at line ${i}`);
  }
}

// Write the file back
fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
