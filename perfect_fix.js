const fs = require('fs');

function fixAll() {
  let content = fs.readFileSync('app.js', 'utf8');
  
  // Normalize line endings
  content = content.replace(/\r\n/g, '\n');

  // 1. Fix LHS assignment "" = localStorage...
  content = content.replace(
    /"" = localStorage\.getItem\("the_chef_youtube_api_key"\) \|\| "";/g,
    ''
  );

  // 2. Fix LHS assignment "" = keyVal;
  content = content.replace(
    /"" = keyVal;/g,
    ''
  );

  // 4. Delete the double else blocks
  // Block 1
  content = content.replace(
    /          \}\);\n    \} else \{\n      if \(recipe\.videoUrl\) \{[\s\S]*?\}, 300\);\n      \}\n    \}/g,
    '          });\n    }'
  );
  
  // Block 2
  content = content.replace(
    /        \}\);\n    \} else \{\n      const fallbackId = validateAndExtractVideoId[\s\S]*?\}, 300\);\n    \}/g,
    '        });\n    }'
  );

  fs.writeFileSync('app.js', content, 'utf8');
}

fixAll();
