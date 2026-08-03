const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split('\n');

// 4766 is index 4765. 4850 is index 4849.
// Slice out the orphaned modal logic that's crashing the script
const newLines = [...lines.slice(0, 4766), ...lines.slice(4851)];

fs.writeFileSync('app.js', newLines.join('\n'), 'utf8');
console.log('Removed orphaned modal logic from app.js');
