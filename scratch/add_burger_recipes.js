const fs = require('fs');
const path = require('path');

const newJsonRecipes = [
  {
    "id": "us-classic-burger",
    "title": "Classic Cheeseburger",
    "cuisine": "American",
    "core_ingredients": [
      "buns",
      "ground beef",
      "onions",
      "ketchup",
      "cheese",
      "lettuce"
    ],
    "flexible_substitutes": {
      "lettuce": ["cabbage", "spinach"],
      "cheese": ["cheddar cheese", "swiss cheese"],
      "buns": ["bread slices", "dinner rolls"]
    },
    "procedure": [
      "Fabricate the ground beef into a circular patty, seasoning both sides with salt and pepper.",
      "Heat a cast-iron skillet (sautoir) over medium-high heat and sear the patty for 3-4 minutes per side until the desired internal temperature is reached.",
      "Place a slice of cheese on the patty during the last minute of cooking to melt.",
      "Sauté sliced onions in the same skillet until lightly caramelized.",
      "Toast the buns lightly in the skillet fat.",
      "Assemble by placing the lettuce on the bottom bun, followed by the cheeseburger patty, caramelized onions, and a drizzle of ketchup. Top with the remaining bun."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    "youtubeVideoIds": ["xQ-Ulm5wOUQ", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
    "story": "The classic American beef burger is a staple of global culinary culture, featuring a seared beef patty with melted cheese, fresh lettuce, and savory ketchup on toasted buns.",
    "nutrients": {
      "calories": "520 kcal",
      "protein": "30g",
      "carbs": "38g",
      "fat": "24g",
      "impact": "High protein source with balanced carbohydrates. Best enjoyed with fresh vegetable toppings."
    }
  },
  {
    "id": "us-beef-sliders",
    "title": "Cheesy Beef Sliders",
    "cuisine": "American",
    "core_ingredients": [
      "buns",
      "ground beef",
      "onions",
      "cheese"
    ],
    "flexible_substitutes": {
      "buns": ["mini buns", "bread slices"],
      "cheese": ["cheddar cheese", "provolone"]
    },
    "procedure": [
      "Divide the ground beef into small 60g portions and shape them into mini patties.",
      "Sear the mini patties in a hot skillet for 2 minutes on each side.",
      "Top each patty with cheese to melt.",
      "Assemble inside the toasted slider buns with minced sautéed onions."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
    "youtubeVideoIds": ["xQ-Ulm5wOUQ", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
    "story": "Miniature versions of the classic cheeseburger, these sliders feature seasoned beef patties, caramelized onions, and melted cheese inside soft mini buns.",
    "nutrients": {
      "calories": "410 kcal",
      "protein": "24g",
      "carbs": "30g",
      "fat": "18g",
      "impact": "Perfect protein-rich finger food or party appetizer."
    }
  },
  {
    "id": "us-bbq-burger",
    "title": "BBQ Beef Burger",
    "cuisine": "American",
    "core_ingredients": [
      "buns",
      "ground beef",
      "onions",
      "ketchup"
    ],
    "flexible_substitutes": {
      "buns": ["bread slices", "dinner rolls"],
      "ketchup": ["bbq sauce", "tomato sauce"]
    },
    "procedure": [
      "Season the ground beef patty and grill or pan-sear for 4 minutes on the first side.",
      "Flip the patty and brush generously with BBQ sauce or seasoned ketchup.",
      "Sear for another 3 minutes until fully cooked.",
      "Serve on toasted buns with a layer of sautéed sweet onions."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800",
    "youtubeVideoIds": ["xQ-Ulm5wOUQ", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
    "story": "A sweet and smoky variation of the hamburger, basted with rich barbeque sauce and topped with caramelized onions.",
    "nutrients": {
      "calories": "490 kcal",
      "protein": "28g",
      "carbs": "44g",
      "fat": "20g",
      "impact": "Satisfies savory and sweet cravings. Sautéed onions provide valuable antioxidants."
    }
  },
  {
    "id": "us-patty-melt",
    "title": "Patty Melt Sandwich",
    "cuisine": "American",
    "core_ingredients": [
      "buns",
      "ground beef",
      "onions",
      "cheese"
    ],
    "flexible_substitutes": {
      "buns": ["rye bread", "sandwich bread"],
      "cheese": ["swiss cheese", "cheddar cheese"]
    },
    "procedure": [
      "Press the ground beef into a thin oval patty matching the shape of your bread.",
      "Cook the patty in a hot skillet for 3 minutes per side; remove and set aside.",
      "Butter one side of each slice of bread/bun.",
      "Assemble the sandwich with cheese, caramelized onions, and the beef patty in the center.",
      "Grill the assembled sandwich in the skillet on low heat until the bread is golden brown and the cheese is fully melted."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&q=80&w=800",
    "youtubeVideoIds": ["xQ-Ulm5wOUQ", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
    "story": "A classic diner sandwich consisting of a beef patty, Swiss or Cheddar cheese, and caramelized onions grilled between toasted rye or sandwich bread.",
    "nutrients": {
      "calories": "580 kcal",
      "protein": "32g",
      "carbs": "34g",
      "fat": "28g",
      "impact": "A hearty combination method dish featuring melted proteins and high calcium."
    }
  },
  {
    "id": "us-steak-sandwich",
    "title": "Gourmet Steak Sandwich",
    "cuisine": "American",
    "core_ingredients": [
      "buns",
      "beef",
      "onions",
      "cheese"
    ],
    "flexible_substitutes": {
      "buns": ["sub rolls", "baguettes"],
      "beef": ["sirloin steak", "ribeye slices", "flank steak"]
    },
    "procedure": [
      "Sauté sliced onions in oil until caramelized.",
      "Sear the thinly sliced beef steak in a screaming hot skillet for 1-2 minutes until browned.",
      "Melt the cheese over the hot beef steak slices.",
      "Load the cheesy steak and onions into toasted rolls/buns."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800",
    "youtubeVideoIds": ["xQ-Ulm5wOUQ", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
    "story": "Tender, thinly sliced grilled beef steak piled high on a toasted bun with sweet caramelized onions and melted cheese.",
    "nutrients": {
      "calories": "540 kcal",
      "protein": "36g",
      "carbs": "36g",
      "fat": "22g",
      "impact": "Excellent source of iron and high-quality protein for muscle recovery."
    }
  },
  {
    "id": "us-mini-sliders",
    "title": "Mini Hamburger Sliders",
    "cuisine": "American",
    "core_ingredients": [
      "buns",
      "ground beef",
      "onions",
      "ketchup"
    ],
    "flexible_substitutes": {
      "buns": ["mini buns", "dinner rolls"],
      "ketchup": ["tomato paste", "bbq sauce"]
    },
    "procedure": [
      "Shape ground beef into two small slider patties.",
      "Sauté the onions until soft and slightly sweet.",
      "Pan-sear the patties for 2 minutes on each side.",
      "Toast mini buns, apply ketchup, and assemble with patties and sweet onions."
    ],
    "imageUrl": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
    "youtubeVideoIds": ["xQ-Ulm5wOUQ", "q9D4H4G9p9Q", "b9P1O4K9p8T"],
    "story": "Delicious mini burgers grilled with sweet onions and a touch of ketchup, perfect for quick lunches or snacks.",
    "nutrients": {
      "calories": "380 kcal",
      "protein": "22g",
      "carbs": "32g",
      "fat": "16g",
      "impact": "Moderate calorie meal with rich protein content."
    }
  }
];

const newJsRecipes = [
  {
    id: "us-classic-burger",
    name: "Classic Cheeseburger",
    culture: "American",
    category: "Dinner",
    story: "The classic American beef burger is a staple of global culinary culture, featuring a seared beef patty with melted cheese, fresh lettuce, and savory ketchup on toasted buns.",
    ingredients: ["buns", "ground beef", "onions", "ketchup", "cheese", "lettuce"],
    detailedIngredients: [
      { name: "Hamburger Buns", amount: "1" },
      { name: "Ground Beef", amount: "150g" },
      { name: "Sliced Onion", amount: "1/2" },
      { name: "Ketchup", amount: "1 tablespoon" },
      { name: "Cheddar Cheese", amount: "1 slice" },
      { name: "Lettuce Leaf", amount: "1" }
    ],
    procedure: [
      "Fabricate the ground beef into a circular patty, seasoning both sides with salt and pepper.",
      "Heat a cast-iron skillet (sautoir) over medium-high heat and sear the patty for 3-4 minutes per side until the desired internal temperature is reached.",
      "Place a slice of cheese on the patty during the last minute of cooking to melt.",
      "Sauté sliced onions in the same skillet until lightly caramelized.",
      "Toast the buns lightly in the skillet fat.",
      "Assemble by placing the lettuce on the bottom bun, followed by the cheeseburger patty, caramelized onions, and a drizzle of ketchup. Top with the remaining bun."
    ],
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "520 kcal",
      protein: "30g",
      carbs: "38g",
      fat: "24g",
      impact: "High protein source with balanced carbohydrates. Best enjoyed with fresh vegetable toppings."
    }
  },
  {
    id: "us-beef-sliders",
    name: "Cheesy Beef Sliders",
    culture: "American",
    category: "Lunch",
    story: "Miniature versions of the classic cheeseburger, these sliders feature seasoned beef patties, caramelized onions, and melted cheese inside soft mini buns.",
    ingredients: ["buns", "ground beef", "onions", "cheese"],
    detailedIngredients: [
      { name: "Slider Buns", amount: "2" },
      { name: "Ground Beef", amount: "120g" },
      { name: "Onions (minced)", amount: "1/4 cup" },
      { name: "Cheese Slices", amount: "2" }
    ],
    procedure: [
      "Divide the ground beef into small 60g portions and shape them into mini patties.",
      "Sear the mini patties in a hot skillet for 2 minutes on each side.",
      "Top each patty with cheese to melt.",
      "Assemble inside the toasted slider buns with minced sautéed onions."
    ],
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "410 kcal",
      protein: "24g",
      carbs: "30g",
      fat: "18g",
      impact: "Perfect protein-rich finger food or party appetizer."
    }
  },
  {
    id: "us-bbq-burger",
    name: "BBQ Beef Burger",
    culture: "American",
    category: "Dinner",
    story: "A sweet and smoky variation of the hamburger, basted with rich barbeque sauce and topped with caramelized onions.",
    ingredients: ["buns", "ground beef", "onions", "ketchup"],
    detailedIngredients: [
      { name: "Hamburger Buns", amount: "1" },
      { name: "Ground Beef", amount: "150g" },
      { name: "Sliced Onion", amount: "1/2" },
      { name: "BBQ/Ketchup Sauce", amount: "2 tablespoons" }
    ],
    procedure: [
      "Season the ground beef patty and grill or pan-sear for 4 minutes on the first side.",
      "Flip the patty and brush generously with BBQ sauce or seasoned ketchup.",
      "Sear for another 3 minutes until fully cooked.",
      "Serve on toasted buns with a layer of sautéed sweet onions."
    ],
    image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "490 kcal",
      protein: "28g",
      carbs: "44g",
      fat: "20g",
      impact: "Satisfies savory and sweet cravings. Sautéed onions provide valuable antioxidants."
    }
  },
  {
    id: "us-patty-melt",
    name: "Patty Melt Sandwich",
    culture: "American",
    category: "Lunch",
    story: "A classic diner sandwich consisting of a beef patty, Swiss or Cheddar cheese, and caramelized onions grilled between toasted rye or sandwich bread.",
    ingredients: ["buns", "ground beef", "onions", "cheese"],
    detailedIngredients: [
      { name: "Bread/Buns", amount: "2 slices" },
      { name: "Ground Beef", amount: "150g" },
      { name: "Sliced Onion", amount: "1/2" },
      { name: "Swiss/Cheddar Cheese", amount: "2 slices" }
    ],
    procedure: [
      "Press the ground beef into a thin oval patty matching the shape of your bread.",
      "Cook the patty in a hot skillet for 3 minutes per side; remove and set aside.",
      "Butter one side of each slice of bread/bun.",
      "Assemble the sandwich with cheese, caramelized onions, and the beef patty in the center.",
      "Grill the assembled sandwich in the skillet on low heat until the bread is golden brown and the cheese is fully melted."
    ],
    image: "https://images.unsplash.com/photo-1521305916504-4a1121188589?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "580 kcal",
      protein: "32g",
      carbs: "34g",
      fat: "28g",
      impact: "A hearty combination method dish featuring melted proteins and high calcium."
    }
  },
  {
    id: "us-steak-sandwich",
    name: "Gourmet Steak Sandwich",
    culture: "American",
    category: "Dinner",
    story: "Tender, thinly sliced grilled beef steak piled high on a toasted bun with sweet caramelized onions and melted cheese.",
    ingredients: ["buns", "beef", "onions", "cheese"],
    detailedIngredients: [
      { name: "Sub Rolls / Buns", amount: "1" },
      { name: "Beef Sirloin (sliced)", amount: "150g" },
      { name: "Onions (sliced)", amount: "1/2" },
      { name: "Provolone/Cheddar Cheese", amount: "2 slices" }
    ],
    procedure: [
      "Sauté sliced onions in oil until caramelized.",
      "Sear the thinly sliced beef steak in a screaming hot skillet for 1-2 minutes until browned.",
      "Melt the cheese over the hot beef steak slices.",
      "Load the cheesy steak and onions into toasted rolls/buns."
    ],
    image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "540 kcal",
      protein: "36g",
      carbs: "36g",
      fat: "22g",
      impact: "Excellent source of iron and high-quality protein for muscle recovery."
    }
  },
  {
    id: "us-mini-sliders",
    name: "Mini Hamburger Sliders",
    culture: "American",
    category: "Lunch",
    story: "Delicious mini burgers grilled with sweet onions and a touch of ketchup, perfect for quick lunches or snacks.",
    ingredients: ["buns", "ground beef", "onions", "ketchup"],
    detailedIngredients: [
      { name: "Mini Buns", amount: "2" },
      { name: "Ground Beef", amount: "100g" },
      { name: "Onions (finely sliced)", amount: "1/4 cup" },
      { name: "Ketchup", amount: "1 tablespoon" }
    ],
    procedure: [
      "Shape ground beef into two small slider patties.",
      "Sauté the onions until soft and slightly sweet.",
      "Pan-sear the patties for 2 minutes on each side.",
      "Toast mini buns, apply ketchup, and assemble with patties and sweet onions."
    ],
    image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "380 kcal",
      protein: "22g",
      carbs: "32g",
      fat: "16g",
      impact: "Moderate calorie meal with rich protein content."
    }
  }
];

// 1. Update recipesData.json
const jsonPath = path.join(__dirname, '..', 'recipesData.json');
let jsonData = [];
if (fs.existsSync(jsonPath)) {
  jsonData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
}

newJsonRecipes.forEach(recipe => {
  if (!jsonData.some(r => r.id === recipe.id)) {
    jsonData.push(recipe);
  }
});

fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
console.log('Successfully updated recipesData.json');

// 2. Update recipes.js
const jsPath = path.join(__dirname, '..', 'recipes.js');
let jsContent = fs.readFileSync(jsPath, 'utf8');

// Locate the end of the recipes array (which is right before 'const LOCALIZATIONS' or similar)
const marker = 'const LOCALIZATIONS';
const markerIndex = jsContent.indexOf(marker);

if (markerIndex !== -1) {
  // Let's find the closing square bracket ']' right before LOCALIZATIONS declaration
  const precedingStr = jsContent.substring(0, markerIndex);
  const closingBracketIndex = precedingStr.lastIndexOf('];');
  
  if (closingBracketIndex !== -1) {
    // Generate the JS code to append
    let recipesJsStr = ',\n' + newJsRecipes.map(r => {
      return `  {\n` +
             `    id: ${JSON.stringify(r.id)},\n` +
             `    name: ${JSON.stringify(r.name)},\n` +
             `    culture: ${JSON.stringify(r.culture)},\n` +
             `    category: ${JSON.stringify(r.category)},\n` +
             `    story: ${JSON.stringify(r.story)},\n` +
             `    ingredients: ${JSON.stringify(r.ingredients)},\n` +
             `    detailedIngredients: ${JSON.stringify(r.detailedIngredients, null, 6).replace(/\"/g, '')},\n` +
             `    procedure: ${JSON.stringify(r.procedure, null, 6).replace(/\"/g, '')},\n` +
             `    image: ${JSON.stringify(r.image)},\n` +
             `    videoUrl: ${JSON.stringify(r.videoUrl)},\n` +
             `    youtubeVideoId: ${JSON.stringify(r.youtubeVideoId)},\n` +
             `    nutrition: ${JSON.stringify(r.nutrition, null, 6).replace(/\"/g, '')}\n` +
             `  }`;
    }).join(',\n') + '\n';
    
    const newJsContent = jsContent.substring(0, closingBracketIndex) + recipesJsStr + jsContent.substring(closingBracketIndex);
    fs.writeFileSync(jsPath, newJsContent, 'utf8');
    console.log('Successfully updated recipes.js');
  } else {
    console.error('Could not find closing bracket preceding LOCALIZATIONS');
  }
} else {
  console.error('Could not find LOCALIZATIONS marker in recipes.js');
}
