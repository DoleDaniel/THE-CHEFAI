const fs = require('fs');
const path = require('path');

const recipesDataPath = path.join(__dirname, '..', 'recipesData.json');
const recipesJsPath = path.join(__dirname, '..', 'recipes.js');

const data = JSON.parse(fs.readFileSync(recipesDataPath, 'utf8'));
console.log('recipesData.json count:', data.length);

// Let's load recipes.js in a simple way (since it is a JS file defining RECIPES)
const content = fs.readFileSync(recipesJsPath, 'utf8');

// We can extract recipes by parsing the JS or using a regex for id
const idsInJs = [];
const idRegex = /id:\s*"([^"]+)"/g;
let match;
while ((match = idRegex.exec(content)) !== null) {
  idsInJs.push(match[1]);
}

console.log('recipes.js count of IDs:', idsInJs.length);
console.log('Sample IDs in recipesData.json:', data.slice(0, 3).map(r => r.id));
console.log('Sample IDs in recipes.js:', idsInJs.slice(0, 3));

// Check if all recipes in recipesData.json exist in recipes.js
const idsInData = data.map(r => r.id);
const missingInJs = idsInData.filter(id => !idsInJs.includes(id));
console.log('IDs in recipesData.json but missing in recipes.js:', missingInJs);
