const fs = require('fs');

function cleanHead() {
  const lines = fs.readFileSync('app.js', 'utf8').split(/\r?\n/);
  
  // 1. Fix line 867 (0-indexed line 866)
  if (lines[866].includes('"" = localStorage')) {
    lines[866] = '';
    console.log('Fixed LHS 1 at line 867');
  } else {
    console.log('Line 867 did not match LHS 1, it is: ' + lines[866]);
  }

  // 2. Fix block 1 (lines 1640-1660, 0-indexed 1639-1659)
  if (lines[1639].includes('} else {') && lines[1659].includes('}')) {
    lines.splice(1639, 21, '    }');
    console.log('Fixed Block 1 (lines 1640-1660)');
  } else {
    console.log('Block 1 did not match, line 1640 is: ' + lines[1639]);
  }

  // 3. Fix block 2 (lines 3311-3317, but wait! Since we spliced out 20 lines, the new line numbers are SHIFTED by 20!)
  // New line 3311 is now 3311 - 20 = 3291 (0-indexed 3290)
  if (lines[3290].includes('} else {') && lines[3296].includes('}')) {
    lines.splice(3290, 7, '  }');
    console.log('Fixed Block 2 (was lines 3311-3317, now 3291-3297)');
  } else {
    console.log('Block 2 did not match, line 3291 is: ' + lines[3290]);
  }

  fs.writeFileSync('app.js', lines.join('\n'), 'utf8');
}

cleanHead();
