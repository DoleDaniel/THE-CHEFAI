---
name: the-chef
description: A skill for culinary analysis, matching kitchen ingredients to diverse cultural recipes (Nigerian, Mexican, Brazilian, etc.), planning meals, and providing cooking instructions.
---

# THE CHEF - Culinary Ingestion & Meal suggestion Skill

This skill outlines how to process user ingredients, map them to cultural cuisines, analyze nutritional impact, and structure cooking recommendations.

## 1. Ingredient Inventory Matching
When matching ingredients:
- Group user ingredients by type (proteins, starches, vegetables, spices, oils).
- Match ingredients leniently (e.g., if a recipe calls for "beef" and the user has "meat" or "goat meat", suggest it as a valid substitution).
- Score recipes based on the percentage of required ingredients that are already in the user's kitchen.
- Identify "Missing but Essential" vs. "Missing but Optional" ingredients.

## 2. Recipe Structure Guidelines
Every recipe suggested by this skill must include:
1. **Story/Origin**: A 2-3 sentence paragraph explaining where the food comes from, its cultural significance, and how it is traditionally enjoyed.
2. **Ingredients Checklist**: A split list showing "From Your Kitchen" and "Substitutable/Optional Additions".
3. **Step-by-Step Procedure**: Bulleted steps with precise instructions (temperatures, cooking times, visual cues like "fry until golden brown").
4. **Nutritional Profile**: Calorie estimates, macronutrient ratios (Carbs, Protein, Fats), and specific health impacts (e.g., "high protein", "keto-friendly").
5. **Real Visuals**: High-fidelity YouTube video embedding or link demonstrating a human preparing the exact dish.

## 3. Meal Timing Logic
Align recipes with specific times:
- **Breakfast** (6:00 AM - 9:00 AM): Light, energy-dense, quick preparation (e.g., eggs, plantains, light wraps).
- **Lunch** (12:00 PM - 2:00 PM): Balanced, sustaining meals (e.g., rice dishes, salads, wraps).
- **Dinner** (6:00 PM - 8:30 PM): Hearty, comforting, family-oriented (e.g., stews, soups, roasted meats).
- **Supper** (9:00 PM - 11:00 PM): Very light, sleep-friendly digests (e.g., broths, herbal teas, light snacks).
