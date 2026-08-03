const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);

lines[196] = '  if ('; // Restore line 196

fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
