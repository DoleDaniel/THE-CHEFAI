const fs = require('fs');
const path = require('path');

const newJsonRecipe = {
  "id": "ng-tuwo-okra",
  "title": "Tuwo Masara with Okra Soup and Beef",
  "cuisine": "Nigerian",
  "core_ingredients": [
    "powdered maize",
    "fresh okra",
    "pepper",
    "beef",
    "vegetables"
  ],
  "flexible_substitutes": {
    "powdered maize": ["cornmeal", "maize flour", "corn flour"],
    "fresh okra": ["frozen okra"],
    "pepper": ["scotch bonnet peppers", "cayenne pepper", "chili peppers"],
    "beef": ["goat meat", "tripe", "cow skin"],
    "vegetables": ["spinach", "ugu leaves", "scent leaves"]
  },
  "procedure": [
    "Bring water to a boil in a pot. Gradually whisk in the powdered maize, stirring constantly to prevent lumps.",
    "Reduce heat, cover, and let steam for 10-15 minutes until dense and cooked. Set aside wrapped in cling film/leaves to keep hot (Tuwo Masara).",
    "Boil the beef with sliced onions, seasoning, and salt until tender. Save the broth.",
    "Finely chop or grate the fresh okra.",
    "Add palm oil to another pot, add chopped peppers and beef broth, and bring to a simmer.",
    "Stir in the chopped okra and cook for 3-5 minutes (do not overcook to preserve the draw viscosity).",
    "Add cooked beef and vegetable leaves (spinach/ugu). Simmer for 2 minutes and serve warm with the Tuwo Masara."
  ],
  "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
  "youtubeVideoIds": ["XNSJgnM1YIM", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
  "story": "Tuwo Masara is a staple Northern Nigerian cornmeal swallow. Okra soup (Obe Ila) is a highly popular, viscous vegetable soup across Nigeria, perfectly paired with the dense swallow and savory beef.",
  "nutrients": {
    "calories": "450 kcal",
    "protein": "28g",
    "carbs": "56g",
    "fat": "15g",
    "impact": "Okra provides valuable soluble fibers for digestion, while the cornmeal swallow provides sustained complex carbohydrates."
  }
};

const newJsRecipe = {
  id: "ng-tuwo-okra",
  name: "Tuwo Masara with Okra Soup and Beef",
  culture: "Nigerian",
  category: "Dinner",
  story: "Tuwo Masara is a staple Northern Nigerian cornmeal swallow. Okra soup (Obe Ila) is a highly popular, viscous vegetable soup across Nigeria, perfectly paired with the dense swallow and savory beef.",
  ingredients: ["powdered maize", "fresh okra", "pepper", "beef", "vegetables"],
  detailedIngredients: [
    { name: "Powdered Maize (Cornmeal)", amount: "2 cups" },
    { name: "Fresh Okra (chopped)", amount: "200g" },
    { name: "Scotch Bonnet Pepper (minced)", amount: "1" },
    { name: "Beef Flank / Sirloin", amount: "300g" },
    { name: "Spinach / Ugu Leaves", amount: "1 cup" }
  ],
  procedure: [
    "Bring water to a boil in a pot. Gradually whisk in the powdered maize, stirring constantly to prevent lumps.",
    "Reduce heat, cover, and let steam for 10-15 minutes until dense and cooked. Set aside wrapped in cling film/leaves to keep hot (Tuwo Masara).",
    "Boil the beef with sliced onions, seasoning, and salt until tender. Save the broth.",
    "Finely chop or grate the fresh okra.",
    "Add palm oil to another pot, add chopped peppers and beef broth, and bring to a simmer.",
    "Stir in the chopped okra and cook for 3-5 minutes (do not overcook to preserve the draw viscosity).",
    "Add cooked beef and vegetable leaves (spinach/ugu). Simmer for 2 minutes and serve warm with the Tuwo Masara."
  ],
  image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
  videoUrl: "https://www.youtube.com/embed/XNSJgnM1YIM",
  youtubeVideoId: "XNSJgnM1YIM",
  nutrition: {
    calories: "450 kcal",
    protein: "28g",
    carbs: "56g",
    fat: "15g",
    impact: "Okra provides valuable soluble fibers for digestion, while the cornmeal swallow provides sustained complex carbohydrates."
  }
};

// 1. Update recipesData.json
const jsonPath = path.join(__dirname, '..', 'recipesData.json');
let jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

if (!jsonData.some(r => r.id === newJsonRecipe.id)) {
  jsonData.push(newJsonRecipe);
}

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
console.log('Successfully added ng-tuwo-okra to recipesData.json');

// 2. Update recipes.js
const jsPath = path.join(__dirname, '..', 'recipes.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

if (!jsContent.includes('ng-tuwo-okra')) {
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
      console.log('Successfully added ng-tuwo-okra to recipes.js');
    }
  }
}
