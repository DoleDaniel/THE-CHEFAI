const fs = require('fs');
const path = require('path');
const { RECIPES } = require('../recipes');

const recipesDataPath = path.join(__dirname, '..', 'recipesData.json');
const recipesDatabase = JSON.parse(fs.readFileSync(recipesDataPath, 'utf8'));

function cleanWord(word) {
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

function matchRecipe(queryText) {
  const lowerQuery = queryText.toLowerCase();
  
  // Clean query of noise words
  const cleanQuery = lowerQuery
    .replace(/(traditional|classic|authentic|easy|homemade|style|raw|how|to|make|recipe|cook|with)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  let bestMatch = null;
  let bestScore = -1;

  recipesDatabase.forEach(recipe => {
    let score = 0;
    
    // 1. Title match (highest priority)
    const cleanTitle = recipe.title.toLowerCase()
      .replace(/(traditional|classic|authentic|easy|homemade|style|raw)/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (cleanQuery.includes(cleanTitle) || cleanTitle.includes(cleanQuery)) {
      score += 100; // Strong title match
    }

    // Word overlap count
    const titleWords = cleanTitle.split(" ").filter(w => w.length > 3);
    const queryWords = cleanQuery.split(/[^a-zA-Z]/).filter(w => w.length > 3);
    
    let titleWordOverlap = 0;
    titleWords.forEach(word => {
      if (queryWords.includes(word)) {
        titleWordOverlap++;
      }
    });
    score += titleWordOverlap * 10;

    // 2. Ingredient overlap match
    let ingredientOverlap = 0;
    recipe.core_ingredients.forEach(coreIng => {
      const cleanCore = cleanWord(coreIng);
      // Check if this ingredient is mentioned in the query
      if (queryWords.some(qw => cleanCore.includes(qw) || qw.includes(cleanCore))) {
        ingredientOverlap++;
      } else if (recipe.flexible_substitutes && recipe.flexible_substitutes[coreIng]) {
        // Check flexible substitutes
        const subs = recipe.flexible_substitutes[coreIng];
        const subMatched = subs.some(sub => {
          const cleanSub = cleanWord(sub);
          return queryWords.some(qw => cleanSub.includes(qw) || qw.includes(cleanSub));
        });
        if (subMatched) {
          ingredientOverlap++;
        }
      }
    });

    score += ingredientOverlap * 5;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = recipe;
    }
  });

  return { recipe: bestMatch, score: bestScore };
}

// Test cases
const testQueries = [
  "How to cook Jollof Rice",
  "bean cakes Akara recipe",
  "spinach, egusi, fish",
  "black-eyed beans, palm oil, onions",
  "roma tomatoes, rice, beef",
  "something totally random"
];

testQueries.forEach(q => {
  const res = matchRecipe(q);
  console.log(`Query: "${q}" -> Matched: "${res.recipe ? res.recipe.title : 'None'}" (Score: ${res.score})`);
});
