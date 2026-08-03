const fs = require('fs');
let lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);

for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === 'if (') {
    lines[i] = '  if ("" === "backend-managed") {';
    console.log('Fixed line ' + i);
  }
}

fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
