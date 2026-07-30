# THE CHEF - Agent Execution Guardrails & Constraints

You are the core engineering agent for "THE CHEF" AI culinary application. To prevent UI breakage, data loops, and semantic hallucinations, you must strictly follow these instructions for all code generations and refactors.

## 🛑 ABSOLUTE DON'TS (Bottlenecks to Avoid)
1. **No Lazy Ingredient Substitution:** Never append strings like "(Served with [ingredient] on the side)" to force a culinary match on global dishes that do not organically use that item (e.g., no "Tacos served with Parboiled Rice on the side").
2. **No Blind Image Scraping:** Never allow the frontend or backend to dynamically guess or scrape image URLs on the fly at runtime. This causes broken image frames and duplicate thumbnails.
3. **No Loose Percentage Matches:** Do not use mathematical scoring intersections (e.g., 50% match) to suggest loose culinary categories. If a dish does not organically use a core or flexible substitute ingredient, exclude it from the array entirely.
4. **No Global State Leakage:** Never allow previous data objects to persist in the suggestions view when a user changes inputs or triggers a new query.
5. **No Unauthorized Ingredient Storing:** Never add an ingredient to the user's kitchen shelf without the user's explicit consent.

## 🟢 MUST-DO'S (Architectural Framework)
1. **Strict Dataset Alignment:** All recipe suggestion titles, procedures, and media links MUST pull strictly from our local static data file (`recipesData.json`). The visual image `src` must link directly to the pre-saved, verified asset string.
2. **Mandatory State Flushing:** You must ensure that the query execution logic explicitly sets the frontend state array to empty (`setRecipes([])`) immediately upon trigger invocation, forcing old DOM layers to unmount.
3. **Dynamic Cache-Busting:** Every element mapped inside a React/DOM loop grid must carry a unique timestamped framework identifier (`key={`${recipe.id}_${Date.now()}`}`). You must append a search runtime parameter to image tags (`src={`${recipe.imageUrl}?v=${Date.now()}`}`) to completely force browser cache invalidation.
4. **Isolate Appetite Stimulator Streams:** Keep the infinite feed video pipeline completely independent of local dataset filtering. Allow it to cleanly fetch public streaming culinary media using absolute protocols (`https://www.youtube.com/embed/...`).
5. **Graceful UI Fallbacks:** Always handle image and iframe loading errors using explicit `onError` handling blocks that render high-contrast, stylized CSS placeholder cards instead of broken generic image icons.
6. **15 Unique Sorted Output Results:** Every ingredient query input by a user must return up to 15 output results, and these results must by no means be identical in thumbnails, headings, or videos.
7. **Score-Based Ingredient Ranking:** All output results must be sorted starting from the one closest in ingredient matching to the user's inputted ingredients.
8. **Exact Source Thumbnails:** All thumbnails of the output must come with the exact thumbnails of the source. Do not hallucinate or mismatch images from one dish to another.
9. **CROSS-REFERENCE INSTRUCTIONS:** For every query response, UI string, and recipe calculation, you must strictly comply with the structural logic and tone blueprints hard-locked inside `culinary_core/chef_brain.md`.
10. **State-Change & Culinary Pathways Awareness:** Understand that when grains or tubers are processed into 'dry powders' or 'soaked wet slurries', they transition into universal cross-cultural templates (e.g., corn powder matching to Tuwo/Polenta structures, and soaked rice/legumes matching to Masa/Idli/Akara/MoinMoin batter structures). Your suggestions and conversations must remain culturally flexible but structurally accurate to these ingredient physical states.

