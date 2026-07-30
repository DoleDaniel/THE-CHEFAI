# Frontend Rendering & State Management Rules

These rules govern frontend state updates, layout rendering, and media integrations to prevent visual regressions, caching loops, or layout breakage.

---

## 1. Mandatory State Flushing
*   **Rule:** The query execution logic MUST explicitly reset the frontend recipe state array to empty immediately upon trigger invocation.
*   **Code Implementation:**
    ```javascript
    setRecipes([]); // Forces old DOM layers to unmount before new data mounts
    ```
*   **Purpose:** Prevents global state leakage and ensures previous data objects do not persist in the suggestions view when inputs change.

---

## 2. Dynamic Cache-Busting
*   **Rule:** Every element rendered within a loop/grid must carry a unique timestamped identifier.
*   **Code Implementation:**
    *   **React/DOM Key:**
        ```javascript
        key={`${recipe.id}_${Date.now()}`}
        ```
    *   **Image Sources:** Append a search runtime parameter to force browser cache invalidation:
        ```javascript
        src={`${recipe.imageUrl}?v=${Date.now()}`}
        ```
*   **Purpose:** Ensures instant visual updates and prevents browsers from rendering stale images or elements during query changes.

---

## 3. Appetite Stimulator Stream Isolation
*   **Rule:** Keep the infinite feed video pipeline completely independent of local dataset filtering. 
*   **Implementation:**
    *   Fetch public streaming culinary media using absolute protocols:
        ```text
        https://www.youtube.com/embed/...
        ```
    *   Do not mix local state filtering logic into the streaming feed.

---

## 4. Graceful UI Fallbacks
*   **Rule:** Always handle image and iframe loading errors using explicit `onError` handling blocks.
*   **Implementation:**
    *   If a thumbnail or video fails to load, render a high-contrast, stylized CSS placeholder card.
    *   If the YouTube fallback fails or isn't applicable, render the clean error placeholder directly.
    *   Ensure exact fallback logic exists for user avatars and recipe cards.

---

## 5. Ingredient Display Formatting (Bracket Omission)
*   **Rule:** When rendering ingredients, the application MUST NOT append units or quantity placeholders in brackets if they represent non-quantified elements.
*   **Implementation:**
    *   If the ingredient's amount is `"To taste"` or `"N/A"` (case-insensitive), display the name only. Do not show empty parentheses or `(To taste)`.
    *   Only append the amount in parentheses, e.g., `Ingredient Name (Amount)`, if a specific, quantified measurement is provided.

---

## 6. Portion & Servings Scaling UI
*   **Rule:** The recipe detail modal must contain a serving size control (servings modifier interface) to allow the user to scale ingredients and nutrition facts.
*   **Implementation:**
    *   Default serving count is 2.
    *   Provide interactive decrement (`-`) and increment (`+`) buttons.
    *   Dynamically scale the ingredient checklist amounts and the nutrition facts grid values in real-time when servings change.
