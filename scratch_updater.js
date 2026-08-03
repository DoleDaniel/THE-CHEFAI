
const fs = require("fs");
const path = require("path");

const appJsPath = path.join(__dirname, "app.js");
let content = fs.readFileSync(appJsPath, "utf8");

const replacement = `
// --- DYNAMIC YOUTUBE FEED LOGIC ---
const ALL_FEED_CATEGORIES = [
  { id: "cooking", category: "Recipe Show", suffix: "cooking authentic recipe" },
  { id: "travel", category: "Street Vlog", suffix: "street food travel vlog" },
  { id: "challenge", category: "Food Challenge", suffix: "food challenge eating competition" },
  { id: "processing", category: "Food Processing", suffix: "food processing factory machine" },
  { id: "production", category: "Food Production", suffix: "mass food production process" },
  { id: "education", category: "Food Education", suffix: "food science culinary education basics" }
];

async function fetchDynamicCategories(query, mealTimeKeyword, limit = 10) {
  const selectedCategories = shuffleArray([...ALL_FEED_CATEGORIES]).slice(0, 4); // Pick 4 random categories per load
  const cultureLabel = state.feedSearchQuery ? (state.feedSearchQuery.charAt(0).toUpperCase() + state.feedSearchQuery.slice(1)) : "Global Cuisine";
  
  if (!state.youtubeNextPageTokens) state.youtubeNextPageTokens = {};

  const fetchPromises = selectedCategories.map(async (cat) => {
    let finalQuery = "";
    if (cat.id === "cooking") {
      const FEED_SEARCH_POOLS = ["chef secrets", "kitchen secrets", "home style", "traditional recipe", "village food", "gourmet technique", "satisfying cooking ASMR", "quick dinner", "pro chef"];
      const randomKeyword = FEED_SEARCH_POOLS[Math.floor(Math.random() * FEED_SEARCH_POOLS.length)];
      finalQuery = \`authentic \${query} \${mealTimeKeyword} \${cat.suffix} \${randomKeyword}\`;
    } else {
      finalQuery = \`\${query} \${mealTimeKeyword} \${cat.suffix}\`;
    }

    const token = state.youtubeNextPageTokens[cat.id] || "";
    try {
      const res = await fetchYoutubeCulinaryVideos(finalQuery, "", limit, token);
      state.youtubeNextPageTokens[cat.id] = res.nextPageToken || "";
      
      const items = (res || []).map(video => ({
        id: \`yt-\${cat.id}-\${video.videoId}\`,
        name: video.title,
        culture: cultureLabel,
        category: cat.category,
        story: video.description || \`\${cat.category} shared by \${video.channelTitle}\`,
        ingredients: [],
        detailedIngredients: [],
        nutrition: {
          calories: "N/A", protein: "N/A", carbs: "N/A", fat: "N/A",
          impact: \`This is a \${cat.category} fetched directly from YouTube.\`
        },
        image: video.thumbnailUrl,
        videoUrl: \`https://www.youtube.com/embed/\${video.videoId}\`,
        isYoutubeVideo: true,
        channelTitle: video.channelTitle,
        channelId: video.channelId || null
      }));
      return items;
    } catch (err) {
      console.warn(\`Failed to fetch \${cat.id} videos:\`, err);
      return [];
    }
  });

  const resultsArrays = await Promise.all(fetchPromises);
  const allNewItems = resultsArrays.flat();
  return shuffleArray(allNewItems);
}

async function fetchYoutubeFeedVideos() {
  if (state.youtubeFeedVideosFetched) return;
  
  let query = "";
  if (state.feedSearchQuery) {
    if (detectGrainsAndFruitCombination(state.feedSearchQuery)) {
      query = "Oatmeal + Porridge + Smoothie + Overnight Oats";
    } else {
      query = formatQueryForAndLogic(state.feedSearchQuery);
    }
  } else if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
    query = state.activeCultureFilter;
  } else {
    query = (state.profile.country || "Nigerian") + " or international";
  }

  const mealTimeKeyword = getStrictMealTime(state.simulatedTime);
  
  try {
    const newItems = await fetchDynamicCategories(query, mealTimeKeyword, 12);
    state.youtubeFeedVideos = newItems;
    state.youtubeFeedVideosFetched = true;
    renderFeed();
  } catch (error) {
    console.error("Failed to load YouTube feed videos:", error);
  }
}

async function loadMoreFeedVideos() {
  if (state.isLoadingMoreFeed) return;
  state.isLoadingMoreFeed = true;

  const grid = document.getElementById("recipes-feed-grid");
  if (!grid) {
    state.isLoadingMoreFeed = false;
    return;
  }

  const spinner = document.createElement("div");
  spinner.id = "feed-infinite-spinner";
  spinner.style.cssText = "grid-column: 1 / -1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px; color: var(--text-muted); font-size: 0.85rem; width: 100%; text-align: center; gap: 8px;";
  spinner.innerHTML = \`<i class="fa-solid fa-spinner fa-spin" style="font-size: 1.8rem; color: var(--accent-color); margin-bottom: 8px;"></i><span>Loading more mouth-watering delicacies...</span>\`;
  grid.appendChild(spinner);

  let query = "";
  if (state.feedSearchQuery) {
    if (detectGrainsAndFruitCombination(state.feedSearchQuery)) {
      query = "Oatmeal + Porridge + Smoothie + Overnight Oats";
    } else {
      query = formatQueryForAndLogic(state.feedSearchQuery);
    }
  } else if (state.activeCultureFilter && state.activeCultureFilter !== "All" && state.activeCultureFilter !== "") {
    query = state.activeCultureFilter;
  } else {
    query = (state.profile.country || "Nigerian") + " or international";
  }

  const mealTimeKeyword = getStrictMealTime(state.simulatedTime);

  try {
    const newItems = await fetchDynamicCategories(query, mealTimeKeyword, 10);
    
    const spinnerEl = document.getElementById("feed-infinite-spinner");
    if (spinnerEl) spinnerEl.remove();

    if (newItems.length > 0) {
      state.youtubeFeedVideos = [...state.youtubeFeedVideos, ...newItems];
      newItems.forEach(recipe => {
        const card = createRecipeCardElement(recipe);
        grid.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Failed to load more feed videos:", error);
    const spinnerEl = document.getElementById("feed-infinite-spinner");
    if (spinnerEl) spinnerEl.remove();
  } finally {
    state.isLoadingMoreFeed = false;
  }
}
// --- END DYNAMIC YOUTUBE FEED LOGIC ---
`;

// Extract everything between fetchYoutubeFeedVideos and the end of loadMoreFeedVideos
const fetchStartIdx = content.indexOf("async function fetchYoutubeFeedVideos()");
const fetchEndIdx = content.indexOf("async function loadMoreFeedVideos()");

// Find the end of loadMoreFeedVideos by counting braces or searching for next function
// The next function after loadMoreFeedVideos is likely "function getCategoryIcon" or something
const nextFuncIdx = content.indexOf("function", fetchEndIdx + 30);
let endIdx = content.lastIndexOf("}", nextFuncIdx) + 1;
if(nextFuncIdx === -1) endIdx = content.length; // end of file

content = content.substring(0, fetchStartIdx) + replacement + content.substring(endIdx);

fs.writeFileSync(appJsPath, content, "utf8");
console.log("Successfully updated app.js with dynamic categories.");
