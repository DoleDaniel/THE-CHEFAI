const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { RECIPES } = require('./recipes');

// Helper to clean ingredient words (singularization, removing prep terms)
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

// Helper to format ingredients for frontend schema compatibility using exact database quantities
function formatIngredientsForFrontend(recipe) {
  if (recipe && recipe.id) {
    const localRecipe = RECIPES.find(r => r.id === recipe.id);
    if (localRecipe && localRecipe.detailedIngredients) {
      return localRecipe.detailedIngredients.map(ing => `${ing.amount} ${ing.name}`);
    }
  }

  // Fallback to keyword-based quantity estimation if the recipe isn't found in recipes.js
  return recipe.core_ingredients.map(ing => {
    let amount = "As needed";
    const lower = ing.toLowerCase();
    if (lower.includes("rice") || lower.includes("beans") || lower.includes("pasta") || lower.includes("flour") || lower.includes("starch")) amount = "2 cups";
    else if (lower.includes("oil")) amount = "3 tablespoons";
    else if (lower.includes("peppers") || lower.includes("onions") || lower.includes("tomatoes") || lower.includes("garlic cloves") || lower.includes("avocados") || lower.includes("cucumbers")) amount = "3 pcs";
    else if (lower.includes("pepper") || lower.includes("onion") || lower.includes("tomato") || lower.includes("garlic") || lower.includes("lime") || lower.includes("orange")) amount = "1 pc";
    else if (lower.includes("chicken") || lower.includes("beef") || lower.includes("pork") || lower.includes("fish") || lower.includes("belly")) amount = "500g";
    else if (lower.includes("salt") || lower.includes("thyme") || lower.includes("curry") || lower.includes("oregano") || lower.includes("cumin") || lower.includes("paprika") || lower.includes("yeast")) amount = "1 tsp";
    
    return `${amount} ${ing.charAt(0).toUpperCase() + ing.slice(1)}`;
  });
}

function generateLocalRecipeFallback(title) {
  const t = String(title || "").toLowerCase();
  let name = title || "Custom Culinary Creation";
  let cuisine = "Global";
  let story = `A delicious homemade recipe for ${name}.`;
  let core_ingredients = ["water", "salt"];
  let detailedIngredients = [
    { name: "Water", amount: "4 cups" },
    { name: "Salt", amount: "1 tsp" }
  ];
  let procedure = [
    "Prepare all your fresh kitchen ingredients.",
    "Combine ingredients in a cooking pot and simmer over medium heat.",
    "Adjust seasonings to taste and serve warm."
  ];
  let nutrients = {
    calories: "250 kcal",
    protein: "10g",
    carbs: "20g",
    fat: "8g",
    impact: "Hearty and nutritious home-cooked meal."
  };

  if (t.includes("mutton") || t.includes("goat")) {
    name = t.includes("soup") ? "Hearty Mutton Soup" : "Savory Mutton Stew";
    cuisine = "African";
    story = "Mutton soup is a rich, warming broth cooked with tender cuts of goat or mutton meat, aromatic spices, and fresh herbs.";
    core_ingredients = ["mutton meat", "onion", "garlic", "ginger", "scallions", "habanero pepper", "salt", "seasoning cube"];
    detailedIngredients = [
      { name: "Mutton Meat (cubed)", amount: "500g" },
      { name: "Onion (chopped)", amount: "1 large" },
      { name: "Garlic Cloves (minced)", amount: "3" },
      { name: "Ginger Root (grated)", amount: "1 tbsp" },
      { name: "Habanero Pepper (chopped)", amount: "1" },
      { name: "Scallions (sliced)", amount: "3" },
      { name: "Salt", amount: "1 tsp" },
      { name: "Seasoning Cube", amount: "2" }
    ];
    procedure = [
      "Wash the mutton meat thoroughly and cut into bite-sized cubes.",
      "Place mutton in a large pot, add chopped onions, minced garlic, grated ginger, seasoning cubes, and salt.",
      "Pour in enough water to cover the meat, bring to a boil, then cover and simmer on low heat for 45-60 minutes until the meat is tender.",
      "Add chopped habanero pepper and simmer for another 10 minutes to let the flavors fuse.",
      "Garnish with sliced scallions and serve hot as a warming soup."
    ];
    nutrients = {
      calories: "320 kcal",
      protein: "30g",
      carbs: "4g",
      fat: "18g",
      impact: "High protein and iron. Excellent for recovery and warmth."
    };
  } else if (t.includes("chicken")) {
    name = "Savory Grilled Chicken";
    cuisine = "Global";
    story = "Tender, juicy chicken breast marinated in herbs and grilled to perfection.";
    core_ingredients = ["chicken breast", "olive oil", "garlic", "oregano", "lemon", "salt", "black pepper"];
    detailedIngredients = [
      { name: "Chicken Breast", amount: "500g" },
      { name: "Olive Oil", amount: "2 tbsp" },
      { name: "Garlic Cloves (minced)", amount: "3" },
      { name: "Dried Oregano", amount: "1 tbsp" },
      { name: "Lemon (juiced)", amount: "1" },
      { name: "Salt", amount: "1 tsp" },
      { name: "Black Pepper", amount: "1/2 tsp" }
    ];
    procedure = [
      "Marinate chicken breast with olive oil, lemon juice, minced garlic, oregano, salt, and pepper for 20 minutes.",
      "Preheat grill or non-stick skillet to medium-high heat.",
      "Grill chicken for 6-8 minutes per side until the internal temperature reaches 165°F (75°C).",
      "Let rest for 5 minutes before slicing and serving."
    ];
    nutrients = {
      calories: "280 kcal",
      protein: "35g",
      carbs: "2g",
      fat: "14g",
      impact: "High protein, low carb, lean muscle builder."
    };
  } else if (t.includes("beef")) {
    name = "Classic Pan-Seared Beef Steak";
    cuisine = "Global";
    story = "A juicy, tender beef steak seared in a hot cast-iron skillet with butter, garlic, and rosemary.";
    core_ingredients = ["beef steak", "butter", "garlic", "rosemary", "salt", "black pepper"];
    detailedIngredients = [
      { name: "Beef Steak (Ribeye or Sirloin)", amount: "400g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Garlic Cloves (crushed)", amount: "3" },
      { name: "Fresh Rosemary Sprigs", amount: "2" },
      { name: "Salt", amount: "1 tsp" },
      { name: "Black Pepper", amount: "1/2 tsp" }
    ];
    procedure = [
      "Season steak generously with salt and pepper on all sides.",
      "Heat a cast-iron skillet over high heat until smoking.",
      "Sear steak for 2-3 minutes per side for medium-rare.",
      "Add butter, garlic, and rosemary to the pan, baste steak with melted butter for 1 minute.",
      "Remove steak from pan and let rest for 5 minutes before slicing."
    ];
    nutrients = {
      calories: "450 kcal",
      protein: "32g",
      carbs: "1g",
      fat: "32g",
      impact: "Rich in protein, zinc, and B-vitamins. High in healthy fats."
    };
  } else if (t.includes("fish") || t.includes("seafood")) {
    name = "Pan-Seared Garlic Butter Fish Fillet";
    cuisine = "Global";
    story = "Flaky white fish fillets cooked in a rich garlic butter sauce with fresh parsley and lemon squeeze.";
    core_ingredients = ["white fish fillets", "butter", "garlic", "lemon", "parsley", "salt", "pepper"];
    detailedIngredients = [
      { name: "White Fish Fillets (Cod or Tilapia)", amount: "400g" },
      { name: "Butter", amount: "2 tbsp" },
      { name: "Garlic Cloves (minced)", amount: "3" },
      { name: "Lemon (juiced)", amount: "1" },
      { name: "Fresh Parsley (chopped)", amount: "2 tbsp" },
      { name: "Salt", amount: "1/2 tsp" },
      { name: "Black Pepper", amount: "1/4 tsp" }
    ];
    procedure = [
      "Pat fish fillets dry and season with salt and pepper.",
      "Melt butter in a skillet over medium heat.",
      "Add minced garlic and cook for 1 minute until fragrant.",
      "Add fish fillets and cook for 3-4 minutes per side until golden and cooked through.",
      "Squeeze lemon juice, garnish with chopped parsley, and serve immediately."
    ];
    nutrients = {
      calories: "220 kcal",
      protein: "24g",
      carbs: "2g",
      fat: "12g",
      impact: "Lean protein, high in omega-3 fatty acids, extremely light and healthy."
    };
  } else if (t.includes("pastry") || t.includes("pastries")) {
    name = "Golden Baked Breakfast Pastries";
    cuisine = "Global";
    story = "Crispy, golden puff pastry sheets filled with delicious fillings and baked until flaky.";
    core_ingredients = ["puff pastry sheets", "egg wash", "butter"];
    detailedIngredients = [
      { name: "Puff Pastry Sheets", amount: "2 sheets" },
      { name: "Egg (beaten, for wash)", amount: "1" },
      { name: "Butter", amount: "1 tbsp" }
    ];
    procedure = [
      "Preheat oven to 400°F (200°C) and line a baking sheet with parchment paper.",
      "Roll out puff pastry sheets and cut into desired shapes.",
      "Brush pastry tops with egg wash for a golden-brown finish.",
      "Bake for 15-20 minutes until puffed, flaky, and golden-brown."
    ];
    nutrients = {
      calories: "340 kcal",
      protein: "5g",
      carbs: "30g",
      fat: "22g",
      impact: "Satisfying energy-rich baked good. Enjoy in moderation."
    };
  }

  return {
    name,
    id: "yt-res-" + Date.now(),
    culture: cuisine,
    category: "Main Dish",
    story,
    ingredients: detailedIngredients.map(ing => `${ing.amount} ${ing.name}`),
    procedure,
    nutrients,
    image: null,
    imageUrl: null,
    detailedIngredients
  };
}

router.post('/research', async (req, res) => {
  const { videoTitle, videoDescription, ingredients } = req.body;

  if (!videoTitle && (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0)) {
    return res.status(400).json({ error: "Missing 'videoTitle' or 'ingredients' in request body." });
  }

  const queryText = videoTitle || ingredients.join(", ");
  const lowerQuery = queryText.toLowerCase();

  // Load recipesData.json dataset
  const recipesDataPath = path.join(__dirname, 'recipesData.json');
  let recipesDatabase = [];
  try {
    if (fs.existsSync(recipesDataPath)) {
      recipesDatabase = JSON.parse(fs.readFileSync(recipesDataPath, 'utf8'));
    }
  } catch (e) {
    console.error("Error reading recipesData.json in /api/research:", e);
  }

  // Clean the input query of noise words
  const cleanQuery = lowerQuery
    .replace(/(traditional|classic|authentic|easy|homemade|style|raw|how|to|make|recipe|cook|with)/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  let bestMatch = null;
  let bestScore = -1;

  const queryWords = cleanQuery.split(/[^a-zA-Z]/).filter(w => w.length > 2);

  // --- AGENT LEARNING MODULE ---
  // Track user search activity to personalize results
  const activityPath = path.join(__dirname, 'user_activity.json');
  let userActivity = { queries: {} };
  try {
    if (fs.existsSync(activityPath)) {
      userActivity = JSON.parse(fs.readFileSync(activityPath, 'utf8'));
    }
  } catch(e) {
    console.error("Error reading user_activity.json", e);
  }

  // Update activity based on current query words
  queryWords.forEach(word => {
    if (word.length > 3) {
      userActivity.queries[word] = (userActivity.queries[word] || 0) + 1;
    }
  });

  // Persist updated learning data
  try {
    if (!process.env.VERCEL) {
      fs.writeFileSync(activityPath, JSON.stringify(userActivity, null, 2));
    }
  } catch(e) {
    console.error("Error writing user_activity.json", e);
  }
  // -----------------------------

  recipesDatabase.forEach(recipe => {
    let score = 0;
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

    // Apply Agent Learning Boost based on past user activity
    let learningBoost = 0;
    titleWords.forEach(word => {
      if (userActivity.queries[word]) {
        learningBoost += Math.min(userActivity.queries[word] * 2, 20);
      }
    });
    recipe.core_ingredients.forEach(coreIng => {
      const cleanCore = cleanIngredientWord(coreIng);
      if (userActivity.queries[cleanCore]) {
        learningBoost += Math.min(userActivity.queries[cleanCore] * 2, 20);
      }
    });
    score += learningBoost;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = recipe;
    }
  });

  // If score is high enough (solid match), use the local database recipe
  if (bestScore >= 50 && bestMatch) {
    console.log(`[THE CHEF] Research Route matched local recipe database: "${bestMatch.title}" (Score: ${bestScore})`);
    return res.json({
      success: true,
      data: {
        name: bestMatch.title,
        id: bestMatch.id,
        culture: bestMatch.cuisine,
        category: "Main Dish",
        story: bestMatch.story,
        ingredients: formatIngredientsForFrontend(bestMatch),
        procedure: bestMatch.procedure,
        nutrients: bestMatch.nutrients,
        image: bestMatch.imageUrl,
        imageUrl: bestMatch.imageUrl
      }
    });
  }

  // Otherwise, use Google Gemini API to research the recipe dynamically
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey !== 'your_gemini_api_key_here' && apiKey.trim() !== '') {
    try {
      console.log(`[THE CHEF] Researching recipe via Gemini API for title: "${videoTitle}"`);
      const prompt = `You are THE CHEF AI culinary advisor. Generate a realistic, high-quality, human-made recipe based on this YouTube video title: "${videoTitle}" and description: "${videoDescription || ''}".
Return ONLY a valid JSON object matching the following structure (no markdown formatting, no code blocks):
{
  "title": "Recipe Title",
  "cuisine": "Cuisine Name",
  "story": "A short cultural story or description of the dish",
  "core_ingredients": ["ingredient 1", "ingredient 2"],
  "detailedIngredients": [
    {"name": "ingredient 1", "amount": "quantity"},
    {"name": "ingredient 2", "amount": "quantity"}
  ],
  "procedure": [
    "Step 1...",
    "Step 2..."
  ],
  "nutrients": {
    "calories": "350 kcal",
    "protein": "15g",
    "carbs": "40g",
    "fat": "12g",
    "impact": "Health impact text"
  }
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      if (response.ok) {
        const resData = await response.json();
        let text = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        text = text.replace(/```json/i, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(text);
        return res.json({
          success: true,
          data: {
            name: parsed.title,
            id: "yt-res-" + Date.now(),
            culture: parsed.cuisine,
            category: "Main Dish",
            story: parsed.story,
            ingredients: parsed.detailedIngredients.map(ing => `${ing.amount} ${ing.name}`),
            procedure: parsed.procedure,
            nutrients: parsed.nutrients,
            image: null,
            imageUrl: null,
            detailedIngredients: parsed.detailedIngredients
          }
        });
      }
    } catch (err) {
      console.warn("Failed calling Gemini API in /research, falling back to local generator:", err);
    }
  }

  // Fall back to local generated recipe matches
  console.log(`[THE CHEF] Using local fallback generator for: "${videoTitle}"`);
  const fallback = generateLocalRecipeFallback(videoTitle);
  return res.json({
    success: true,
    data: fallback
  });
});

/**
 * GET /api/youtube/status
 * Check if the YOUTUBE_API_KEY is configured in the server's environment.
 */
router.get('/youtube/status', (req, res) => {
  const hasKey = !!(process.env.YOUTUBE_API_KEY && process.env.YOUTUBE_API_KEY.trim() !== '');
  res.json({ hasKey });
});

/**
 * GET /api/youtube/videos
 * Fetch embeddable culinary/cooking videos from YouTube using the server-side API Key.
 * Prevents client-side exposure of the API Key.
 */
// Helper to return secure fallback list representing real-world culinary videos
function getYouTubeFallbacks(maxResults) {
  const fallbacks = [
    { videoId: "xVQ0dDDUil4", title: "Classic Nigerian Egusi Soup", description: "Authentic human-made Nigerian delicacy steps.", channelTitle: "African Food Network", thumbnailUrl: "egusi.png" },
    { videoId: "SYOnZPWTOuk", title: "Authentic Mexican Tacos al Pastor", description: "Master the art of making delicious pork Tacos al Pastor with pineapple.", channelTitle: "Mexican Eats", thumbnailUrl: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800" },
    { videoId: "_EsP0oDXA3g", title: "Traditional Brazilian Feijoada Stew", description: "Deeply savory black bean stew slow-cooked with pork and beef.", channelTitle: "Brazil Kitchen", thumbnailUrl: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800" },
    { videoId: "hFLFBVnImU4", title: "Cheesy Chicken Quesadillas", description: "Spiced chicken folded in toasted flour tortillas with melted cheese.", channelTitle: "Mexico Food Network", thumbnailUrl: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&q=80&w=800" },
    { videoId: "MOv5_fUiar8", title: "Brazilian Fish Moqueca (Moqueca de Peixe)", description: "Traditional Afro-Brazilian seafood stew cooked in coconut milk and dende oil.", channelTitle: "Bahian Flavors", thumbnailUrl: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&q=80&w=800" },
    { videoId: "VyEJTODAd2M", title: "Mexican Bean & Cheese Burritos", description: "Hearty black beans and melted cheese wrapped in toasted flour tortillas.", channelTitle: "Viva Mexico", thumbnailUrl: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=800" },
    { videoId: "HS1Ox1miZYw", title: "Italian Pasta e Fagioli", description: "Classic Italian soup with small pasta, white beans, and fresh herbs in tomato broth.", channelTitle: "Tuscany Cooking", thumbnailUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800" },
    { videoId: "lMviiY8CoaQ", title: "Classic Nigerian Jollof Rice", description: "Legendary West African smoky, tomato-infused party style rice.", channelTitle: "African Food Network", thumbnailUrl: "jollof.png" },
    { videoId: "K4e6q2oVmsY", title: "Spicy Korean Ramen Eating Challenge (Asia)", description: "Fierce spicy noodle mukbang and eating challenge from South Korea.", channelTitle: "Mukbang Mania", thumbnailUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=800" },
    { videoId: "vR8P2J2G-G0", title: "Giant African Fufu & Egusi Soup Challenge (Africa)", description: "Massive fufu and egusi soup eating contest and speed battle in Lagos.", channelTitle: "Naija Bites", thumbnailUrl: "egusi.png" },
    { videoId: "2_1nQOaUj5c", title: "Giant 20-Inch Pizza Speed Eating Challenge (America)", description: "Devouring a massive cheese and pepperoni pizza against the clock.", channelTitle: "Epic Eats USA", thumbnailUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800" },
    { videoId: "Xy39k_K7oQk", title: "The Ultimate Giant English Breakfast Challenge (Europe)", description: "Bacon, sausages, eggs, mushrooms, and baked beans speed eating in London.", channelTitle: "UK Feasts", thumbnailUrl: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&q=80&w=800" }
  ];
  const shuffled = fallbacks.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, maxResults);
}

router.get('/youtube/videos', async (req, res) => {
  const query = req.query.q || '';
  const maxResults = parseInt(req.query.maxResults) || 6;
  const pageToken = req.query.pageToken || '';

  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey || apiKey === 'undefined' || apiKey.trim() === '') {
    console.log(`[THE CHEF] YouTube API key missing. Returning secure local backups for feed.`);
    const items = getYouTubeFallbacks(maxResults);
    return res.json({ success: true, items, nextPageToken: "mock-token" });
  }

  const baseUrl = "https://www.googleapis.com/youtube/v3/search";
  const url = new URL(baseUrl);
  
  url.searchParams.append("part", "snippet");
  url.searchParams.append("type", "video");
  url.searchParams.append("videoEmbeddable", "true");
  url.searchParams.append("q", query);
  url.searchParams.append("key", apiKey);
  url.searchParams.append("maxResults", maxResults.toString());
  if (pageToken) {
    url.searchParams.append("pageToken", pageToken);
  }

  try {
    const response = await fetch(url.toString());
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(`YouTube API Error: ${errData.error?.message || response.statusText}`);
    }
    
    const data = await response.json();
    
    // Map items to simplified object representation
    const items = (data.items || []).map(item => ({
      videoId: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      channelTitle: item.snippet.channelTitle,
      channelId: item.snippet.channelId || null,
      thumbnailUrl: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url
    }));
    
    res.json({ success: true, items, nextPageToken: data.nextPageToken || null });
  } catch (error) {
    console.warn("Error fetching YouTube culinary videos on server, falling back to secure local backups:", error.message);
    const items = getYouTubeFallbacks(maxResults);
    res.json({ success: true, items, nextPageToken: "mock-token", isFallback: true });
  }
});

module.exports = router;
