# Query & Matching Logic Rules

These rules govern how user ingredient queries are processed, filtered, ranked, and matched against the recipe database to prevent incorrect suggestions, duplicate listings, or empty results.

---

## 1. Strict Dataset Alignment
*   **Rule:** All recipe suggestions, titles, procedures, and media links MUST pull strictly from our local static dataset (`recipesData.json`).
*   **Rule:** The visual image `src` must link directly to the pre-saved, verified asset string. Do not guess, generate, or scrape image URLs at runtime.
*   **Rule:** Output thumbnails must match the source recipe exactly without mismatching or hallucinating images between dishes.

---

## 2. Score-Based Ingredient Ranking
*   **Rule:** All matched output results must be sorted starting from the one closest in ingredient matching to the user's inputted ingredients.
*   **Rule:** If a dish does not organically use a core or flexible substitute ingredient, exclude it from suggestions (do not use loose matching percentages like 50% to force culinary match suggestions).

---

## 3. The 15 Unique Sorted Results Constraint
*   **Rule:** Every ingredient query input by a user must return up to 15 output results.
*   **Rule:** These 15 results must be unique. Under no circumstances should they contain identical thumbnails, headings, or video embeds.

---

## 4. Strict Boolean Protein Filtering (Bug 001 Fix)
*   **Rule:** Ingredient matching must use strict logic. If a primary protein constraint (e.g., Beef) is requested and the target recipe uses an alternative (e.g., Chicken), the recipe must be dropped from suggestions. Do not perform lazy keyword description matching (e.g., recommending Chicken Suya because the description mentions beef).

---

## 5. Dynamic Custom Query Evaluation (Bug 002 Fix)
*   **Rule:** Wipe all static cache fallbacks upon input changes. The suggestions must change dynamically based on the current state of logged kitchen ingredients or search queries, avoiding loops of static menus (e.g., Moimoi, Fried Rice, Egusi).

---

## 6. Pantry Flex Protocol (Bug 003 Fix)
*   **Rule:** If core ingredients match but non-essential staple ingredients (e.g., salt, sugar, yeast) are missing from the user's kitchen, classify it as a valid match.
*   **Rule:** Clearly identify and indicate the missing staples via the chatbot interface so the user knows what minor pantry items are required.

---

## 7. Dynamic Video-Ingredient Alignment
*   **Rule:** Every suggested video card displayed in the main feed or recipe details modal must align its listed ingredients and procedures with the video content.
*   **Implementation:**
    *   Compare dynamic YouTube video results against the local database of 30 recipes (matching by exact `videoId` or keyword title overlap).
    *   If a match is found, override the card's details (ingredients, procedure, nutrition) with the corresponding verified database recipe.

---

## 8. Video Description Ingredient Parsing
*   **Rule:** If a dynamic YouTube video does not match any local database recipe, the system should attempt to parse the ingredients list directly from the video description.
*   **Implementation:**
    *   Scan the description for start headers (e.g. `Ingredients:`, `You will need:`) and extract non-empty lines until an end header (e.g. `Method:`, `Instructions:`, `Subscribe`) is encountered.
    *   If parsing fails or no ingredients are found in the description, fall back to the user's searched/query ingredients.

---

## 9. Dynamic Ingredient-Based Nutrition Estimation
*   **Rule:** If a recipe is dynamic or lacks hardcoded nutrition data, the application must compute nutrition facts dynamically based on the ingredient quantities.
*   **Implementation:**
    *   Maintain a local reference dictionary of common ingredients and their nutrient densities per standard units (cups, g, ml, tbsp, tsp, pcs).
    *   Parse the quantities and ingredient names to calculate calories, protein, carbs, and fats.

---

## 10. Selected Cuisine Prioritization
*   **Rule:** When a specific cuisine is selected in the UI dropdown (`state.activeCultureFilter`), the suggestion output must prioritize matches belonging to that cuisine first.
*   **Implementation:**
    *   **Sorting:** Sort matched recipes primarily by whether their cuisine matches the active culture filter (case-insensitive check), followed by match count and match ratio.
    *   **Dynamic Fallback Querying:** When fetching extra YouTube suggestions to reach 15 results, prepend the active culture filter as a search keyword to ensure dynamic recommendations align with the selected cuisine.

