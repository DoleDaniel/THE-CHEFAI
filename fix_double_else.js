const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(/\r\n/g, '\n');

// Block 1 regex
const regex1 = /          \}\);\n    \} else \{\n      if \(recipe\.videoUrl\) \{[\s\S]*?\} else \{/g;

// Block 2 regex
const regex2 = /        \}\);\n    \} else \{\n      const fallbackId[\s\S]*?\}, 300\);\n    \}/g;

appJs = appJs.replace(regex2, '        });');

appJs = appJs.replace(/          \}\);\n    \} else \{\n      if \(recipe\.videoUrl\) \{[\s\S]*?\}, 300\);\n      \}\n    \}/g, '          });');


fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Fixed double else blocks');
