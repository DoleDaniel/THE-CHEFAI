# State-Change & Culinary Pathways Rules

These rules govern the cross-cultural mapping of ingredients and their physical states to ensure suggestions are culturally authentic, physically realistic, and match true culinary properties.

---

## 1. Physical State-Change Mappings

Before matching or suggesting a recipe, the algorithm must evaluate the physical state of the ingredient inputs:

### A. Dry Milled Powders (Starch Gelatinization Rule)
*   **Condition:** If an input grain or tuber is described as a 'powder', 'flour', or 'meal' (e.g., Yam Flour/Elubo, Cornmeal, Tapioca Starch).
*   **Excluded Recipes:** Exclude all whole-grain pilafs/rice dishes, risotto, or whole-boiled tuber dishes (e.g., Yam Porridge, Jollof Rice).
*   **Approved Methods:** Whipping/stirring into boiling liquids for dense starches (Tuwo, Amala, Fufu, Polenta) or baking/frying into doughs (Pão de Queijo, Pizza).

### B. Soaked & Wet-Ground Slurries (Fermented/Aerated Batter Rule)
*   **Condition:** If an input grain or legume is described as 'soaked', 'wet-ground', or 'blended into a paste' (e.g., blended beans, bean paste, wet rice slurry).
*   **Excluded Recipes:** Exclude all whole-legume dishes (e.g., Feijoada, Pasta e Fagioli, Baked Beans, Burrito/Bean Stew).
*   **Approved Methods:** Pan-frying, steaming, or griddling into cakes/fritters (Masa, Sinasir, Akara, Moimoi).

---

## 2. Foundational Ingredient Class Matrix

All incoming ingredients must be categorized into their strict culinary classes, enforcing the following recipe restrictions:

### A. Cereal & Grain Foods (Buns, Flour, Rice, Wheat, Tortillas, Pasta)
*   **Approved Archetypes:** Sandwiches, Burgers, Pilafs, Flatbreads, Pastas.
*   **Strict Constraint:** Never pair baked wheat assets (like buns) with legume-centric purees (like Moimoi) or tuber dishes.

### B. Legumes & Pulses (Beans, Lentils, Peas, Egusi Seeds)
*   **Approved Archetypes:** Moimoi, Akara, Bean Soups, Lentil Curries, Stews.
*   **Strict Constraint:** Never recommend pizza, burgers, or tacos if the primary user inputs are raw legumes without a grain bridge (e.g., whole beans alone cannot make taco shells).

### C. Tubers & Root Crops (Yam, Potatoes, Cassava, Yucca, Boniato)
*   **Approved Archetypes:** Pounded Yam, Asaro (Yam Porridge), Fries, Roasts, Mash.
*   **Strict Constraint:** Never use root tubers as substitutes for thin-grain cereal wrappers (e.g., Yam cannot be used as a substitute to recommend Tacos or Spaghetti).

---

## 3. No Lazy Ingredient Substitution
*   **Rule:** Never append arbitrary strings like "(Served with [ingredient] on the side)" to force a culinary match on global dishes that do not organically use that item (e.g., no "Tacos served with Parboiled Rice on the side").
