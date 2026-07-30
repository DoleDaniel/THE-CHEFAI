const assert = require('assert');
const { RECIPES } = require('../recipes');

// Helper to simulate the route logic locally
const fs = require('fs');
const path = require('path');
const recipesDataPath = path.join(__dirname, '..', 'recipesData.json');
const recipesDatabase = JSON.parse(fs.readFileSync(recipesDataPath, 'utf8'));

// Helper to clean ingredient words
function cleanIngredientWord(word) {
  let w = String(word).toLowerCase().trim();
  const noise = [
    "fresh", "ground", "dried", "chopped", "sliced", "powder", "paste", 
    "leaves", "cloves", "shoulder", "breast", "oil", "sauce", "broth", 
    "stock", "cooked", "canned", "whole", "diced", "finely", "minced"
  ];
  noise.forEach(n => {
    w = w.replace(new RegExp(`\\b${n}\\b`, 'g'), '');
  });
  w = w.replace(/\s+/g, ' ').trim();
  if (w.endsWith("es") && w.length > 4) {
    w = w.slice(0, -2);
  } else if (w.endsWith("s") && !w.endsWith("ss") && w.length > 3) {
    w = w.slice(0, -1);
  }
  return w;
}

// Helper to format ingredients using recipes.js
function formatIngredientsForFrontend(recipe) {
  if (recipe && recipe.id) {
    const localRecipe = RECIPES.find(r => r.id === recipe.id);
    if (localRecipe && localRecipe.detailedIngredients) {
      return localRecipe.detailedIngredients.map(ing => `${ing.amount} ${ing.name}`);
    }
  }
  return recipe.core_ingredients.map(ing => `As needed ${ing}`);
}

function processResearch(body) {
  const { videoTitle, ingredients } = body;
  const queryText = videoTitle || (ingredients ? ingredients.join(", ") : "");
  const lowerQuery = queryText.toLowerCase();

  const cleanQuery = lowerQuery
    .replace(/(traditional|classic|authentic|easy|homemade|style|raw|how|to|make|recipe|cook|with)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  let bestMatch = null;
  let bestScore = -1;

  const queryWords = cleanQuery.split(/[^a-zA-Z]/).filter(w => w.length > 2);

  recipesDatabase.forEach(recipe => {
    let score = 0;
    
    // 1. Title match
    const cleanTitle = recipe.title.toLowerCase()
      .replace(/(traditional|classic|authentic|easy|homemade|style|raw)/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanQuery.includes(cleanTitle) || cleanTitle.includes(cleanQuery)) {
      score += 100;
    }

    const titleWords = cleanTitle.split(" ").filter(w => w.length > 3);
    let titleWordOverlap = 0;
    titleWords.forEach(word => {
      if (queryWords.includes(word)) {
        titleWordOverlap++;
      }
    });
    score += titleWordOverlap * 10;

    // 2. Ingredient overlap
    let ingredientOverlap = 0;
    recipe.core_ingredients.forEach(coreIng => {
      const cleanCore = cleanIngredientWord(coreIng);
      const matchedDirect = queryWords.some(qw => cleanCore.includes(qw) || qw.includes(cleanCore));
      if (matchedDirect) {
        ingredientOverlap++;
      } else if (recipe.flexible_substitutes && recipe.flexible_substitutes[coreIng]) {
        const subs = recipe.flexible_substitutes[coreIng];
        const subMatched = subs.some(sub => {
          const cleanSub = cleanIngredientWord(sub);
          return queryWords.some(qw => cleanSub.includes(qw) || qw.includes(cleanSub));
        });
        if (subMatched) {
          ingredientOverlap++;
        }
      }
    });

    score += ingredientOverlap * 15;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = recipe;
    }
  });

  const match = (bestScore > 0 && bestMatch) ? bestMatch : recipesDatabase[0];
  return {
    title: match.title,
    id: match.id,
    ingredients: formatIngredientsForFrontend(match),
    score: bestScore
  };
}

// 1. Test title match
console.log('Testing exact/partial title match...');
const match1 = processResearch({ videoTitle: "How to make Jollof Rice" });
console.log('Result 1:', match1);
assert.strictEqual(match1.id, 'ng-jollof');
assert.ok(match1.ingredients.includes("3 cups Long-grain Parboiled Rice")); // exact amount check

// 2. Test ingredient array match
console.log('\nTesting ingredient array match...');
const match2 = processResearch({ ingredients: ["spinach", "egusi melon seeds", "locust beans"] });
console.log('Result 2:', match2);
assert.strictEqual(match2.id, 'ng-egusi');
assert.ok(match2.ingredients.includes("2 cups Egusi Melon Seeds (ground)")); // exact amount check

console.log('\nAll assertions passed successfully! Ingredient recognition and detailed quantities are correct!');
