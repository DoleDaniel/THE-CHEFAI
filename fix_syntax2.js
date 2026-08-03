const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(
  /"" = localStorage\.getItem\("the_chef_youtube_api_key"\) \|\| "";/g, 
  ''
);

fs.writeFileSync('app.js', appJs, 'utf8');
console.log("Removed syntax error");
