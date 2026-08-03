const fs = require('fs');

let appJs = fs.readFileSync('app.js', 'utf8');
appJs = appJs.replace(/\} else if \("" \)/g, '} else');
appJs = appJs.replace(/\} else if \(""\) \{/g, '} else {');
fs.writeFileSync('app.js', appJs, 'utf8');
console.log('Fixed else if ("")');
