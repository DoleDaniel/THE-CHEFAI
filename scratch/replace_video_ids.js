const fs = require('fs');
const path = require('path');

const replacements = {
  "ng-moinmoin": { old: "m2gL8P6FvEE", newId: "S8GxrbqpoO8" },
  "ng-yam-porridge": { old: "uP8w1nK99aM", newId: "sEttP7leV78" },
  "mx-enchiladas": { old: "_N0k0P8w8vU", newId: "ptp4NcWxfNE" },
  "mx-guacamole": { old: "d9P4H4G9p9Q", newId: "a6yCQdx3Pkg" },
  "it-risotto": { old: "7p1H4K9p8T4", newId: "GJ_lGFVyecM" },
  "it-bruschetta": { old: "2bM1H4P9p9W", newId: "Q3xg35pcLyo" },
  "it-pizza": { old: "tS9P4H4G9p9", newId: "vcfNpDtVqOw" },
  "as-fried-rice": { old: "5H3Qn3i7H8M", newId: "vxltEx-6IkA" },
  "as-baobuns": { old: "z9P1H3M3p5Q", newId: "Ui_rOkM0bAk" },
  "as-noodles": { old: "3bM1H4P9p9W", newId: "4tTYIU-hRX0" }
};

// 1. Update recipesData.json
const jsonPath = path.join(__dirname, '..', 'recipesData.json');
let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

jsonData.forEach(recipe => {
  if (replacements[recipe.id]) {
    const rep = replacements[recipe.id];
    // Update main video id
    recipe.youtubeVideoId = rep.newId;
    if (recipe.youtubeVideoIds && recipe.youtubeVideoIds.length > 0) {
      recipe.youtubeVideoIds[0] = rep.newId;
    } else {
      recipe.youtubeVideoIds = [rep.newId];
    }
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
console.log('Successfully updated recipesData.json video IDs');

// 2. Update recipes.js
const jsPath = path.join(__dirname, '..', 'recipes.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

for (const [recipeId, rep] of Object.entries(replacements)) {
  const oldId = rep.old;
  const newId = rep.newId;
  
  // Replace youtubeVideoId: "oldId" with "newId"
  const ytRegex = new RegExp(`youtubeVideoId:\\s*["']${oldId}["']`, 'g');
  jsContent = jsContent.replace(ytRegex, `youtubeVideoId: "${newId}"`);
  
  // Replace videoUrl: ".../embed/oldId" with ".../embed/newId"
  const embedRegex = new RegExp(`embed/${oldId}`, 'g');
  jsContent = jsContent.replace(embedRegex, `embed/${newId}`);
}

fs.writeFileSync(jsPath, jsContent, 'utf8');
console.log('Successfully updated recipes.js video IDs');
