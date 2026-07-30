const fs = require('fs');
const path = require('path');

const newJsonRecipe = {
  "id": "us-oatmeal-berries",
  "title": "Classic Berry Oatmeal Porridge",
  "cuisine": "American",
  "core_ingredients": [
    "oats",
    "milk",
    "water",
    "strawberries",
    "honey",
    "cinnamon",
    "salt"
  ],
  "flexible_substitutes": {
    "oats": ["rolled oats", "steel cut oats", "quick oats"],
    "milk": ["almond milk", "soy milk", "oat milk", "coconut milk"],
    "strawberries": ["blueberries", "raspberries", "blackberries", "banana slices"],
    "honey": ["maple syrup", "agave nectar", "sugar", "brown sugar"]
  },
  "procedure": [
    "In a small saucepan, bring water and milk to a gentle boil.",
    "Stir in the oats and a pinch of salt. Reduce heat to low and simmer for 5-7 minutes, stirring occasionally, until the oats are tender and creamy.",
    "Remove from heat. Stir in a dash of cinnamon and honey to sweeten.",
    "Pour into a bowl and top generously with fresh sliced strawberries and an extra drizzle of honey."
  ],
  "imageUrl": "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=800",
  "youtubeVideoIds": ["mRGs9zK4wOU", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
  "story": "Oatmeal porridge is a timeless breakfast classic across many global cultures. Rich in complex carbs and fibers, topped with fresh summer berries and natural honey, it represents a perfectly balanced start to the day.",
  "nutrients": {
    "calories": "310 kcal",
    "protein": "8g",
    "carbs": "54g",
    "fat": "5g",
    "impact": "High in beta-glucan soluble fiber for heart health and sustained morning energy release."
  }
};

const newJsRecipe = {
  id: "us-oatmeal-berries",
  name: "Classic Berry Oatmeal Porridge",
  culture: "American",
  category: "Breakfast",
  story: "Oatmeal porridge is a timeless breakfast classic across many global cultures. Rich in complex carbs and fibers, topped with fresh summer berries and natural honey, it represents a perfectly balanced start to the day.",
  ingredients: ["oats", "milk", "water", "strawberries", "honey", "cinnamon", "salt"],
  detailedIngredients: [
    { name: "Rolled Oats", amount: "1 cup" },
    { name: "Whole Milk / Almond Milk", amount: "1 cup" },
    { name: "Water", amount: "1 cup" },
    { name: "Fresh Strawberries (sliced)", amount: "1/2 cup" },
    { name: "Honey / Maple Syrup", amount: "1 tbsp" },
    { name: "Ground Cinnamon", amount: "1/4 tsp" },
    { name: "Salt", amount: "1 pinch" }
  ],
  procedure: [
    "In a small saucepan, bring water and milk to a gentle boil.",
    "Stir in the oats and a pinch of salt. Reduce heat to low and simmer for 5-7 minutes, stirring occasionally, until the oats are tender and creamy.",
    "Remove from heat. Stir in a dash of cinnamon and honey to sweeten.",
    "Pour into a bowl and top generously with fresh sliced strawberries and an extra drizzle of honey."
  ],
  image: "https://images.unsplash.com/photo-1517686469429-8bdb88b9f907?auto=format&fit=crop&q=80&w=800",
  videoUrl: "https://www.youtube.com/embed/mRGs9zK4wOU",
  youtubeVideoId: "mRGs9zK4wOU",
  nutrition: {
    calories: "310 kcal",
    protein: "8g",
    carbs: "54g",
    fat: "5g",
    impact: "High in beta-glucan soluble fiber for heart health and sustained morning energy release."
  }
};

// 1. Update recipesData.json
const jsonPath = path.join(__dirname, '..', 'recipesData.json');
let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (!jsonData.some(r => r.id === newJsonRecipe.id)) {
  jsonData.push(newJsonRecipe);
}

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
console.log('Successfully added us-oatmeal-berries to recipesData.json');

// 2. Update recipes.js
const jsPath = path.join(__dirname, '..', 'recipes.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

if (!jsContent.includes('us-oatmeal-berries')) {
  const marker = 'const LOCALIZATIONS';
  const markerIndex = jsContent.indexOf(marker);
  
  if (markerIndex !== -1) {
    const precedingStr = jsContent.substring(0, markerIndex);
    const closingBracketIndex = precedingStr.lastIndexOf('];');
    
    if (closingBracketIndex !== -1) {
      const recipesJsStr = ',\n  {\n' +
        `    id: ${JSON.stringify(newJsRecipe.id)},\n` +
        `    name: ${JSON.stringify(newJsRecipe.name)},\n` +
        `    culture: ${JSON.stringify(newJsRecipe.culture)},\n` +
        `    category: ${JSON.stringify(newJsRecipe.category)},\n` +
        `    story: ${JSON.stringify(newJsRecipe.story)},\n` +
        `    ingredients: ${JSON.stringify(newJsRecipe.ingredients)},\n` +
        `    detailedIngredients: ${JSON.stringify(newJsRecipe.detailedIngredients, null, 6).replace(/\"/g, '')},\n` +
        `    procedure: ${JSON.stringify(newJsRecipe.procedure, null, 6).replace(/\"/g, '')},\n` +
        `    image: ${JSON.stringify(newJsRecipe.image)},\n` +
        `    videoUrl: ${JSON.stringify(newJsRecipe.videoUrl)},\n` +
        `    youtubeVideoId: ${JSON.stringify(newJsRecipe.youtubeVideoId)},\n` +
        `    nutrition: ${JSON.stringify(newJsRecipe.nutrition, null, 6).replace(/\"/g, '')}\n` +
        `  }`;
      
      const newJsContent = jsContent.substring(0, closingBracketIndex) + recipesJsStr + jsContent.substring(closingBracketIndex);
      fs.writeFileSync(jsPath, newJsContent, 'utf8');
      console.log('Successfully added us-oatmeal-berries to recipes.js');
    }
  }
}
