const fs = require('fs');
const path = require('path');

// Read recipes.js and add the export if not present, then try to require it
const recipesJsPath = path.join(__dirname, '..', 'recipes.js');
let content = fs.readFileSync(recipesJsPath, 'utf8');

if (!content.includes('module.exports')) {
  content += '\nif (typeof module !== \'undefined\' && typeof module.exports !== \'undefined\') {\n  module.exports = { RECIPES };\n}\n';
  fs.writeFileSync(recipesJsPath, content, 'utf8');
  console.log('Appended module.exports to recipes.js');
}

try {
  const { RECIPES } = require(recipesJsPath);
  console.log('Success! RECIPES length:', RECIPES.length);
  console.log('First recipe name:', RECIPES[0].name);
  console.log('First recipe detailed ingredients:', RECIPES[0].detailedIngredients);
} catch (err) {
  console.error('Error requiring recipes.js:', err);
}
