const RECIPES = [
  {
    id: "ng-jollof",
    name: "Classic Nigerian Jollof Rice",
    culture: "Nigerian",
    category: "Lunch",
    story: "Jollof Rice is the crown jewel of West African cuisine. It is a legendary, smoky, tomato-infused rice dish cooked in a rich broth of peppers, onions, and spices. Serving it is the hallmark of any Nigerian celebration.",
    ingredients: [
      "long-grain parboiled rice",
      "roma tomatoes",
      "red bell peppers",
      "scotch bonnet peppers",
      "onions",
      "tomato paste",
      "chicken stock",
      "dried thyme",
      "curry powder",
      "bay leaves",
      "vegetable oil",
      "salt"
    ],
    detailedIngredients: [
      { name: "Long-grain Parboiled Rice", amount: "3 cups" },
      { name: "Roma Tomatoes", amount: "5 medium" },
      { name: "Red Bell Peppers", amount: "3 large" },
      { name: "Scotch Bonnet Peppers", amount: "2" },
      { name: "Onions", amount: "2 medium" },
      { name: "Tomato Paste", amount: "3 tablespoons" },
      { name: "Chicken Stock", amount: "4 cups" },
      { name: "Dried Thyme", amount: "1 teaspoon" },
      { name: "Curry Powder", amount: "1 teaspoon" },
      { name: "Bay Leaves", amount: "3" },
      { name: "Vegetable Oil", amount: "1/2 cup" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Blend the tomatoes, red bell peppers, Scotch bonnet peppers, and one onion until smooth. Boil the mixture down to half its volume.",
      "Heat vegetable oil in a large pot and fry sliced remaining onions for 3-5 minutes.",
      "Add tomato paste and fry for 5 minutes, stirring constantly.",
      "Pour in the boiled tomato-pepper mixture and fry for 8-10 minutes.",
      "Add thyme, curry powder, bay leaves, salt, and seasoning. Stir in chicken stock and bring to a boil.",
      "Add washed parboiled rice. Cover tightly with foil and a lid, and cook on low heat for 25-30 minutes."
    ],
    image: "jollof.png",
    videoUrl: "https://www.youtube.com/embed/lMviiY8CoaQ",
    youtubeVideoId: "lMviiY8CoaQ",
    nutrition: {
      calories: "380 kcal",
      protein: "8g",
      carbs: "62g",
      fat: "11g",
      impact: "Rich in vitamin C from tomatoes and peppers. Provides slow-release carbohydrates for sustained energy."
    }
  },
  {
    id: "ng-egusi",
    name: "Nigerian Egusi Soup with Pounded Yam",
    culture: "Nigerian",
    category: "Lunch",
    story: "Egusi soup is a rich, nutty soup made from ground melon seeds, leafy greens, and assorted meats. It is one of Nigeria's most popular soups and is famously paired with pounded yam or eba.",
    ingredients: [
      "egusi melon seeds",
      "palm oil",
      "beef",
      "stockfish",
      "dry fish",
      "crayfish",
      "spinach",
      "onions",
      "scotch bonnet peppers",
      "locust beans"
    ],
    detailedIngredients: [
      { name: "Egusi Melon Seeds (ground)", amount: "2 cups" },
      { name: "Palm Oil", amount: "1/2 cup" },
      { name: "Assorted Meats (Beef, Tripe)", amount: "500g" },
      { name: "Stockfish (pre-soaked)", amount: "1 piece" },
      { name: "Dry Smoked Fish", amount: "2 medium" },
      { name: "Ground Crayfish", amount: "3 tablespoons" },
      { name: "Fresh Spinach", amount: "2 cups chopped" },
      { name: "Onion", amount: "1 large" },
      { name: "Scotch Bonnet Peppers", amount: "2" },
      { name: "Locust Beans (Iru)", amount: "2 tablespoons" }
    ],
    procedure: [
      "Boil the beef, stockfish, and tripe with chopped onions and salt until tender. Reserve the broth.",
      "Mix ground egusi seeds with a little water to form a thick paste.",
      "Heat palm oil in a pot (do not bleach), add locust beans and chopped onions, and fry for 2 minutes.",
      "Add the egusi paste in small lumps and fry on medium heat for 10 minutes until crumbs form.",
      "Add the beef broth, scotch bonnet peppers, cooked meats, and stockfish. Simmer for 15 minutes.",
      "Stir in ground crayfish, salt, and chopped spinach. Simmer for 3 minutes and serve with pounded yam."
    ],
    image: "egusi.png",
    videoUrl: "https://www.youtube.com/embed/xVQ0dDDUil4",
    youtubeVideoId: "xVQ0dDDUil4",
    nutrition: {
      calories: "450 kcal",
      protein: "28g",
      carbs: "12g",
      fat: "32g",
      impact: "High in healthy fats, protein, and essential micronutrients like Vitamin A and iron."
    }
  },
  {
    id: "ng-akara",
    name: "Crispy Nigerian Akara (Bean Cakes)",
    culture: "Nigerian",
    category: "Breakfast",
    story: "Akara is a crispy, golden fritter made from skinned black-eyed beans blended with peppers and onions. It is a classic Nigerian breakfast staple, typically served with hot pap or fresh bread.",
    ingredients: [
      "black-eyed beans",
      "onions",
      "scotch bonnet peppers",
      "vegetable oil",
      "salt"
    ],
    detailedIngredients: [
      { name: "Black-eyed Beans (peeled)", amount: "2 cups" },
      { name: "Onion (chopped)", amount: "1 large" },
      { name: "Scotch Bonnet Pepper", amount: "2" },
      { name: "Vegetable Oil (for frying)", amount: "2 cups" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Soak beans in water, rub between palms to peel off the skins, and rinse thoroughly.",
      "Blend the peeled beans, scotch bonnet peppers, and half of the onion with minimal water to form a thick paste.",
      "Whisk the paste vigorously for 5-10 minutes to incorporate air for a fluffy texture.",
      "Stir in salt and the remaining chopped onions.",
      "Heat vegetable oil in a deep frying pan and scoop spoonfuls of batter into the hot oil.",
      "Fry for 3-4 minutes per side until golden brown and crispy."
    ],
    image: "akara.jpg",
    videoUrl: "https://www.youtube.com/embed/UmRpVzo58x8",
    youtubeVideoId: "UmRpVzo58x8",
    nutrition: {
      calories: "210 kcal",
      protein: "9g",
      carbs: "22g",
      fat: "10g",
      impact: "High-protein, gluten-free, vegetarian breakfast option. High in dietary fiber."
    }
  },
  {
    id: "ng-moinmoin",
    name: "Nigerian Moin Moin",
    culture: "Nigerian",
    category: "Breakfast",
    story: "Moin Moin is a savory West African steamed bean pudding made from a mixture of washed and peeled black-eyed beans, onions, and fresh ground peppers.",
    ingredients: [
      "black-eyed beans",
      "red bell peppers",
      "onions",
      "vegetable oil",
      "boiled eggs",
      "crayfish",
      "salt"
    ],
    detailedIngredients: [
      { name: "Black-eyed Beans (peeled)", amount: "2 cups" },
      { name: "Red Bell Peppers", amount: "2 large" },
      { name: "Onion", amount: "1 large" },
      { name: "Vegetable Oil", amount: "1/4 cup" },
      { name: "Boiled Eggs (sliced)", amount: "2" },
      { name: "Ground Crayfish", amount: "2 tablespoons" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Soak beans, peel skins off, and blend with red bell peppers, scotch bonnet, and onions to form a smooth batter.",
      "Stir in vegetable oil, ground crayfish, salt, and warm water/chicken stock until it reaches a pancake batter consistency.",
      "Pour the batter into oiled tins, leaves, or foil pockets.",
      "Add sliced boiled eggs or flaked fish on top of each portion.",
      "Place in a pot of boiling water on a stand, cover tightly, and steam for 40-50 minutes until firm.",
      "Let cool slightly and serve."
    ],
    image: "moin_moin.png",
    videoUrl: "https://www.youtube.com/embed/S8GxrbqpoO8",
    youtubeVideoId: "S8GxrbqpoO8",
    nutrition: {
      calories: "220 kcal",
      protein: "14g",
      carbs: "28g",
      fat: "6g",
      impact: "Low fat, high protein and fiber. Excellent clean source of energy."
    }
  },
  {
    id: "ng-yam-porridge",
    name: "Nigerian Yam Porridge (Asaro)",
    culture: "Nigerian",
    category: "Lunch",
    story: "Asaro is a traditional Yoruba yam porridge. It is a hearty, one-pot dish where yams are cooked in a savory pepper, tomato, and palm oil sauce until tender and creamy.",
    ingredients: [
      "puna yam",
      "palm oil",
      "onions",
      "roma tomatoes",
      "scotch bonnet peppers",
      "crayfish",
      "spinach",
      "salt"
    ],
    detailedIngredients: [
      { name: "Puna Yam (cubed)", amount: "1 tuber" },
      { name: "Palm Oil", amount: "1/3 cup" },
      { name: "Onion (chopped)", amount: "1 large" },
      { name: "Roma Tomatoes", amount: "3 medium" },
      { name: "Scotch Bonnet Peppers", amount: "2" },
      { name: "Ground Crayfish", amount: "2 tablespoons" },
      { name: "Fresh Spinach (chopped)", amount: "1 cup" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Peel the yam and cut into medium cubes. Rinse and place in a pot.",
      "Blend tomatoes, scotch bonnet, and onions, and add to the pot along with enough water to cover the yams.",
      "Bring to a boil, then add palm oil, ground crayfish, salt, and seasoning cubes.",
      "Cook on medium heat for 20-25 minutes until the yams are soft.",
      "Use a wooden spoon to mash some of the yams to thicken the porridge broth.",
      "Stir in chopped spinach and simmer for an additional 3 minutes. Serve hot."
    ],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/vrv-4KP3Oc0",
    youtubeVideoId: "vrv-4KP3Oc0",
    nutrition: {
      calories: "390 kcal",
      protein: "6g",
      carbs: "74g",
      fat: "9g",
      impact: "High in potassium, fiber, and complex carbohydrates to fuel long days."
    }
  },
  {
    id: "ng-suya-chicken",
    name: "Nigerian Suya Grilled Chicken",
    culture: "Nigerian",
    category: "Dinner",
    story: "Suya is a popular West African street food skewer. Traditionally made with beef, this chicken version utilizes the legendary peanut-based yaji spice blend for a spicy, nutty, smoky flavor.",
    ingredients: [
      "chicken breast",
      "suya spice",
      "vegetable oil",
      "onions",
      "cucumbers",
      "salt"
    ],
    detailedIngredients: [
      { name: "Chicken Breast (strips)", amount: "500g" },
      { name: "Suya Spice (Yaji)", amount: "4 tablespoons" },
      { name: "Vegetable Oil", amount: "2 tablespoons" },
      { name: "Onions (sliced)", amount: "1 large" },
      { name: "Cucumbers (sliced)", amount: "1 medium" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Slice chicken breast into thin, flat strips.",
      "Coat chicken strips in vegetable oil, then dredge generously in suya spice (yaji) until completely covered.",
      "Thread the chicken onto wooden skewers soaked in water.",
      "Preheat your grill or oven to 400°F (200°C).",
      "Grill the chicken skewers for 12-15 minutes, flipping once, until fully cooked and slightly charred.",
      "Serve warm garnished with sliced raw onions, tomatoes, and cucumbers."
    ],
    image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/xQ-Ulm5wOUQ",
    youtubeVideoId: "xQ-Ulm5wOUQ",
    nutrition: {
      calories: "310 kcal",
      protein: "35g",
      carbs: "4g",
      fat: "17g",
      impact: "Very high protein, low carb, keto-friendly option. Peanut spice provides healthy fats."
    }
  },
  {
    id: "mx-tacos",
    name: "Authentic Mexican Tacos al Pastor",
    culture: "Mexican",
    category: "Dinner",
    story: "Tacos al Pastor developed in Central Mexico as a fusion of Lebanese shawarma and Mexican marinades. Pork is marinated in dried chilies, spices, and pineapple juice, then roasted and sliced into corn tortillas.",
    ingredients: [
      "pork shoulder",
      "achiote paste",
      "guajillo chilies",
      "pineapple juice",
      "white vinegar",
      "garlic",
      "oregano",
      "corn tortillas",
      "cilantro",
      "onions",
      "lime"
    ],
    detailedIngredients: [
      { name: "Pork Shoulder (sliced thin)", amount: "1 kg" },
      { name: "Achiote Paste", amount: "3 tablespoons" },
      { name: "Guajillo Chilies", amount: "3" },
      { name: "Pineapple Juice", amount: "1/2 cup" },
      { name: "White Vinegar", amount: "1/4 cup" },
      { name: "Garlic Cloves", amount: "4" },
      { name: "Dried Mexican Oregano", amount: "1 teaspoon" },
      { name: "Fresh Corn Tortillas", amount: "12" },
      { name: "Fresh Cilantro (chopped)", amount: "1/2 cup" },
      { name: "White Onion (chopped)", amount: "1/2 cup" },
      { name: "Fresh Pineapple (sliced)", amount: "1 cup" },
      { name: "Lime Wedges", amount: "For serving" }
    ],
    procedure: [
      "Soak guajillo chilies in boiling water for 15 minutes, then drain.",
      "Blend softened chilies, achiote paste, pineapple juice, vinegar, garlic, oregano, and cumin until smooth.",
      "Coat thin pork slices in the marinade and refrigerate for 4 hours.",
      "Cook pork in a hot skillet until charred and cooked through, then chop.",
      "Warm tortillas on a griddle, top with pork, grilled pineapple pieces, onions, and cilantro.",
      "Serve hot with lime wedges."
    ],
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/SYOnZPWTOuk",
    youtubeVideoId: "SYOnZPWTOuk",
    nutrition: {
      calories: "320 kcal",
      protein: "24g",
      carbs: "28g",
      fat: "12g",
      impact: "High protein, rich in zinc and B vitamins. Cilantro and onions add antioxidants, and lime provides vitamin C."
    }
  },
  {
    id: "mx-quesadilla",
    name: "Cheesy Chicken Quesadillas",
    culture: "Mexican",
    category: "Lunch",
    story: "Quesadillas are a beloved Mexican staple, dating back to colonial times. While cheese is the star, modern variations include spiced shredded chicken, vegetables, and hot salsas folded in toasted flour tortillas.",
    ingredients: [
      "flour tortillas",
      "mozzarella cheese",
      "chicken breast",
      "bell peppers",
      "onions",
      "cumin",
      "paprika",
      "garlic powder",
      "olive oil"
    ],
    detailedIngredients: [
      { name: "Flour Tortillas (large)", amount: "4" },
      { name: "Mozzarella Cheese (shredded)", amount: "2 cups" },
      { name: "Chicken Breast (shredded)", amount: "300g" },
      { name: "Bell Pepper (sliced)", amount: "1" },
      { name: "Onion (sliced)", amount: "1/2" },
      { name: "Ground Cumin", amount: "1/2 teaspoon" },
      { name: "Smoked Paprika", amount: "1 teaspoon" },
      { name: "Garlic Powder", amount: "1/2 teaspoon" },
      { name: "Olive Oil", amount: "2 tablespoons" }
    ],
    procedure: [
      "Sauté sliced onions and bell peppers in a skillet with olive oil until soft; set aside.",
      "Sauté diced chicken in the same skillet, seasoning with paprika, cumin, garlic powder, salt, and pepper.",
      "Place a flour tortilla on a skillet over medium heat.",
      "Sprinkle cheese, chicken, peppers, onions, and more cheese on one half.",
      "Fold the empty half over the filling and cook for 2-3 minutes per side until golden and crispy and cheese is melted."
    ],
    image: "https://images.unsplash.com/photo-1618040996337-56904b7850b9?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/hFLFBVnImU4",
    youtubeVideoId: "hFLFBVnImU4",
    nutrition: {
      calories: "410 kcal",
      protein: "32g",
      carbs: "30g",
      fat: "18g",
      impact: "High protein and calcium. Balanced profile of carbs and fats suitable for an active lifestyle."
    }
  },
  {
    id: "mx-burrito",
    name: "Mexican Bean & Cheese Burritos",
    culture: "Mexican",
    category: "Lunch",
    story: "Burritos originated in Northern Mexico as a portable, filling meal. Large flour tortillas are wrapped around seasoned beans, melted cheese, and vegetables, toasted on a griddle.",
    ingredients: [
      "black beans",
      "flour tortillas",
      "cheddar cheese",
      "onions",
      "garlic",
      "tomato paste",
      "cumin",
      "vegetable oil"
    ],
    detailedIngredients: [
      { name: "Black Beans (cooked)", amount: "2 cups" },
      { name: "Large Flour Tortillas", amount: "4" },
      { name: "Cheddar Cheese (shredded)", amount: "1.5 cups" },
      { name: "Onion (chopped)", amount: "1 medium" },
      { name: "Garlic Cloves (minced)", amount: "2" },
      { name: "Tomato Paste", amount: "1 tablespoon" },
      { name: "Ground Cumin", amount: "1/2 teaspoon" },
      { name: "Vegetable Oil", amount: "1 tablespoon" }
    ],
    procedure: [
      "Heat oil in a skillet, sauté chopped onion and garlic until soft.",
      "Add tomato paste, ground cumin, and cooked black beans. Mash beans slightly to create a thick mixture.",
      "Warm the flour tortillas on a dry skillet for 10 seconds per side.",
      "Spread bean mixture and shredded cheese in the center of each tortilla.",
      "Fold in the sides of the tortilla and roll up tightly. Toast in pan for 1-2 minutes per side."
    ],
    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/VyEJTODAd2M",
    youtubeVideoId: "VyEJTODAd2M",
    nutrition: {
      calories: "410 kcal",
      protein: "16g",
      carbs: "54g",
      fat: "14g",
      impact: "High in fiber, protein, and complex carbohydrates. Provides sustained energy release."
    }
  },
  {
    id: "mx-enchiladas",
    name: "Traditional Beef Enchiladas",
    culture: "Mexican",
    category: "Dinner",
    story: "Enchiladas date back to Mayan times when people in the Valley of Mexico rolled corn tortillas around fish. Today, they are filled with meats, smothered in chili sauce, and baked.",
    ingredients: [
      "ground beef",
      "corn tortillas",
      "cheddar cheese",
      "enchilada sauce",
      "onions",
      "garlic",
      "chili powder",
      "cumin",
      "olive oil"
    ],
    detailedIngredients: [
      { name: "Ground Beef", amount: "500g" },
      { name: "Corn Tortillas", amount: "8" },
      { name: "Cheddar Cheese (shredded)", amount: "2 cups" },
      { name: "Enchilada Sauce", amount: "2 cups" },
      { name: "Onion (chopped)", amount: "1 medium" },
      { name: "Garlic Cloves (minced)", amount: "2" },
      { name: "Chili Powder", amount: "1 tablespoon" },
      { name: "Ground Cumin", amount: "1 teaspoon" },
      { name: "Olive Oil", amount: "2 tablespoons" }
    ],
    procedure: [
      "Preheat oven to 375°F (190°C). Sauté chopped onions and garlic in a skillet with olive oil.",
      "Add ground beef, chili powder, cumin, salt, and pepper, cooking until beef is fully browned; drain fat.",
      "Dip corn tortillas in warm enchilada sauce to soften.",
      "Fill each tortilla with beef and cheese, roll tightly, and place seam-side down in a baking dish.",
      "Pour remaining sauce over the rolls and top with cheese. Bake for 20 minutes until bubbling."
    ],
    image: "https://images.unsplash.com/photo-1533959887222-72227222b404?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/ptp4NcWxfNE",
    youtubeVideoId: "ptp4NcWxfNE",
    nutrition: {
      calories: "480 kcal",
      protein: "28g",
      carbs: "36g",
      fat: "24g",
      impact: "High protein, calcium, and iron. Energy dense and extremely comforting."
    }
  },
  {
    id: "mx-guacamole",
    name: "Fresh Guacamole with Tortilla Chips",
    culture: "Mexican",
    category: "Breakfast",
    story: "Guacamole was created by the Aztecs in Central Mexico. Made with rich avocados, tomatoes, onions, and lime, it has become one of the world's favorite dips.",
    ingredients: [
      "avocados",
      "lime",
      "roma tomatoes",
      "onions",
      "cilantro",
      "jalapenos",
      "tortilla chips",
      "salt"
    ],
    detailedIngredients: [
      { name: "Avocados (ripe)", amount: "3" },
      { name: "Lime (juiced)", amount: "1" },
      { name: "Roma Tomatoes (diced)", amount: "2" },
      { name: "Onion (finely chopped)", amount: "1/2" },
      { name: "Fresh Cilantro (chopped)", amount: "1/4 cup" },
      { name: "Jalapeno Pepper (minced)", amount: "1" },
      { name: "Tortilla Chips", amount: "1 bag" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Cut avocados in half, remove the pit, and scoop the flesh into a bowl.",
      "Use a fork to mash the avocado to your desired consistency (chunky or smooth).",
      "Immediately stir in lime juice to prevent browning.",
      "Add diced tomatoes, finely chopped onion, minced jalapeno, and chopped cilantro.",
      "Season with salt to taste and stir gently to combine.",
      "Serve immediately with a basket of crispy corn tortilla chips."
    ],
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/a6yCQdx3Pkg",
    youtubeVideoId: "a6yCQdx3Pkg",
    nutrition: {
      calories: "280 kcal",
      protein: "3g",
      carbs: "18g",
      fat: "23g",
      impact: "Packed with heart-healthy monounsaturated fats, potassium, and dietary fiber."
    }
  },
  {
    id: "br-feijoada",
    name: "Traditional Brazilian Feijoada",
    culture: "Brazilian",
    category: "Dinner",
    story: "Feijoada is the national dish of Brazil. It is a deeply savory black bean stew slow-cooked with a variety of salted pork and beef products. Traditionally eaten on Saturday afternoons with family and friends.",
    ingredients: [
      "black beans",
      "beef chuck",
      "pork belly",
      "smoked sausage",
      "smoked bacon",
      "onions",
      "garlic",
      "bay leaves",
      "orange",
      "salt"
    ],
    detailedIngredients: [
      { name: "Black Beans (soaked)", amount: "500g" },
      { name: "Beef Chuck (diced)", amount: "300g" },
      { name: "Pork Belly (diced)", amount: "250g" },
      { name: "Smoked Sausage (sliced)", amount: "250g" },
      { name: "Smoked Bacon (diced)", amount: "150g" },
      { name: "Onions (chopped)", amount: "2 large" },
      { name: "Garlic Cloves (minced)", amount: "5" },
      { name: "Bay Leaves", amount: "3" },
      { name: "Orange (halved)", amount: "1" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Drain soaked black beans and place in a large pot, cover with water, and boil.",
      "In a skillet, brown bacon, pork belly, and beef chuck. Transfer to the bean pot.",
      "Add bay leaves and a halved peeled orange to the pot. Simmer on low heat for 1.5 to 2 hours.",
      "Slice the smoked sausage and add it to the pot for the last 30 minutes.",
      "Sauté chopped onions and minced garlic in bacon fat. Mash a ladle of beans in the skillet and return to the main pot to thicken.",
      "Simmer for 15 minutes, remove orange halves, adjust seasoning, and serve."
    ],
    image: "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/_EsP0oDXA3g",
    youtubeVideoId: "_EsP0oDXA3g",
    nutrition: {
      calories: "510 kcal",
      protein: "38g",
      carbs: "45g",
      fat: "20g",
      impact: "Extremely high in protein, iron, and dietary fiber from black beans. Very filling and satisfying."
    }
  },
  {
    id: "br-coxinha",
    name: "Brazilian Chicken Croquettes (Coxinha)",
    culture: "Brazilian",
    category: "Supper",
    story: "Coxinha is a popular Brazilian street food shaped like a chicken thigh. It consists of shredded spiced chicken wrapped in a potato-based dough, coated in breadcrumbs, and deep-fried to crispy perfection.",
    ingredients: [
      "chicken breast",
      "chicken broth",
      "flour",
      "potato",
      "cream cheese",
      "onions",
      "garlic",
      "breadcrumbs",
      "eggs",
      "vegetable oil"
    ],
    detailedIngredients: [
      { name: "Chicken Breast", amount: "400g" },
      { name: "Chicken Broth", amount: "3 cups" },
      { name: "All-purpose Flour", amount: "3 cups" },
      { name: "Potato (boiled and mashed)", amount: "1 cup" },
      { name: "Cream Cheese", amount: "1/2 cup" },
      { name: "Onion (chopped)", amount: "1" },
      { name: "Garlic Cloves (minced)", amount: "3" },
      { name: "Breadcrumbs", amount: "2 cups" },
      { name: "Eggs (beaten)", amount: "2" },
      { name: "Vegetable Oil (for frying)", amount: "3 cups" }
    ],
    procedure: [
      "Poach chicken breast in broth until cooked, shred, and set chicken broth aside.",
      "Sauté onions and garlic. Add chicken, salt, pepper, and cream cheese; let cool.",
      "Bring chicken broth to a boil, stir in mashed potato, and add flour all at once.",
      "Stir vigorously on low heat until dough pulls away from pot walls. Knead dough until smooth.",
      "Shape dough into cups, fill with chicken mixture, and pinch the top to form a teardrop shape.",
      "Dip in beaten eggs, coat with breadcrumbs, and deep-fry in hot oil until golden."
    ],
    image: "https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/RMtQhqDHD-M",
    youtubeVideoId: "RMtQhqDHD-M",
    nutrition: {
      calories: "280 kcal",
      protein: "14g",
      carbs: "30g",
      fat: "12g",
      impact: "A comforting carbohydrate and protein treat. Best enjoyed in moderation as an occasional snack."
    }
  },
  {
    id: "br-paodequeijo",
    name: "Brazilian Cheese Bread (Pão de Queijo)",
    culture: "Brazilian",
    category: "Breakfast",
    story: "Originating from Minas Gerais, Pão de Queijo is a gluten-free cheese roll. Made from cassava (tapioca) starch, milk, oil, eggs, and local cheese, it is crisp on the outside and wonderfully chewy and cheesy on the inside.",
    ingredients: [
      "tapioca starch",
      "milk",
      "vegetable oil",
      "eggs",
      "parmesan cheese",
      "mozzarella cheese",
      "salt"
    ],
    detailedIngredients: [
      { name: "Tapioca Flour (Starch)", amount: "2.5 cups" },
      { name: "Milk", amount: "1/2 cup" },
      { name: "Vegetable Oil", amount: "1/3 cup" },
      { name: "Eggs", amount: "2 large" },
      { name: "Parmesan Cheese (grated)", amount: "1 cup" },
      { name: "Mozzarella Cheese (shredded)", amount: "1 cup" },
      { name: "Salt", amount: "1 teaspoon" }
    ],
    procedure: [
      "Preheat oven to 200°C (400°F). Combine milk, water, oil, and salt in a pan and bring to a boil.",
      "Pour hot liquid over tapioca flour in a bowl, stir well, and let cool for 10 minutes.",
      "Knead the mixture, adding eggs one at a time, until a sticky dough forms.",
      "Fold in grated Parmesan and shredded Mozzarella cheese, kneading until integrated.",
      "Grease hands, roll dough into small balls, and place on a lined baking sheet.",
      "Bake for 15-20 minutes until puffed up and golden."
    ],
    image: "https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/nWuO3NfXkEg",
    youtubeVideoId: "nWuO3NfXkEg",
    nutrition: {
      calories: "150 kcal",
      protein: "4g",
      carbs: "18g",
      fat: "7g",
      impact: "Naturally gluten-free. Provides quick energy from cassava starch and calcium from cheeses."
    }
  },
  {
    id: "br-moqueca",
    name: "Brazilian Fish Moqueca (Moqueca de Peixe)",
    culture: "Brazilian",
    category: "Dinner",
    story: "Moqueca is a traditional Afro-Brazilian seafood stew from Bahia. Fish is slow-cooked in coconut milk, lime juice, palm oil (azeite de dendê), peppers, onions, and tomatoes in a clay pot.",
    ingredients: [
      "white fish",
      "coconut milk",
      "bell peppers",
      "onions",
      "tomatoes",
      "garlic",
      "lime",
      "coriander",
      "palm oil"
    ],
    detailedIngredients: [
      { name: "White Fish Fillets (Cod, Snapper)", amount: "500g" },
      { name: "Coconut Milk", amount: "1 cup" },
      { name: "Bell Peppers (sliced)", amount: "2" },
      { name: "Onions (sliced)", amount: "1 large" },
      { name: "Roma Tomatoes (sliced)", amount: "2" },
      { name: "Garlic Cloves (minced)", amount: "3" },
      { name: "Lime (juiced)", amount: "1" },
      { name: "Fresh Coriander (chopped)", amount: "1/2 cup" },
      { name: "Palm Oil (Dendê)", amount: "3 tablespoons" }
    ],
    procedure: [
      "Marinate fish fillets in lime juice, minced garlic, salt, and pepper for 20 minutes.",
      "In a wide pot, layer half of the sliced onions, bell peppers, and tomatoes.",
      "Place marinated fish fillets on top of the vegetables in a single layer.",
      "Cover with the remaining onions, bell peppers, and tomatoes.",
      "Pour coconut milk and palm oil over the layered ingredients.",
      "Cover and simmer on medium-low heat for 15-20 minutes until fish flakes easily. Garnish with coriander."
    ],
    image: "https://images.unsplash.com/photo-1547928576-a4a3323dce9d?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/MOv5_fUiar8",
    youtubeVideoId: "MOv5_fUiar8",
    nutrition: {
      calories: "340 kcal",
      protein: "26g",
      carbs: "12g",
      fat: "22g",
      impact: "High in protein and healthy fats from coconut milk. Rich in essential minerals like selenium and potassium."
    }
  },
  {
    id: "it-pasta-beans",
    name: "Italian Pasta e Fagioli (Pasta and Beans)",
    culture: "Italian",
    category: "Lunch",
    story: "Pasta e Fagioli is a classic Italian peasant dish. It is a hearty, comforting stew made with small pasta, white beans, garlic, and fresh herbs cooked in a rich tomato broth.",
    ingredients: [
      "beans",
      "pasta",
      "tomatoes",
      "onions",
      "garlic",
      "vegetable oil",
      "oregano",
      "vegetable stock"
    ],
    detailedIngredients: [
      { name: "Cannellini Beans (cooked)", amount: "2 cups" },
      { name: "Small Pasta (Ditalini)", amount: "1.5 cups" },
      { name: "Diced Tomatoes", amount: "1 can (400g)" },
      { name: "Onion (diced)", amount: "1 medium" },
      { name: "Garlic Cloves (minced)", amount: "2" },
      { name: "Olive Oil", amount: "2 tablespoons" },
      { name: "Dried Oregano", amount: "1 teaspoon" },
      { name: "Vegetable Stock", amount: "3 cups" }
    ],
    procedure: [
      "In a large pot, heat oil over medium heat and sauté chopped onion and garlic until soft.",
      "Add diced tomatoes, beans, oregano, and vegetable stock. Bring to a boil.",
      "Ladle out 1 cup of beans, mash them, and return to the pot to thicken the soup.",
      "Add the pasta directly to the pot. Cook on medium-low heat, stirring frequently, until pasta is al dente.",
      "Adjust seasoning with salt and pepper and serve hot."
    ],
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/HS1Ox1miZYw",
    youtubeVideoId: "HS1Ox1miZYw",
    nutrition: {
      calories: "380 kcal",
      protein: "14g",
      carbs: "68g",
      fat: "6g",
      impact: "Low in fat, rich in complex carbohydrates and plant protein. Great source of dietary fiber."
    }
  },
  {
    id: "it-risotto",
    name: "Classic Risotto Milanese",
    culture: "Italian",
    category: "Lunch",
    story: "Risotto Milanese is a classic Italian northern specialty. Rice is cooked slowly by adding broth ladle-by-ladle, creating a luxurious, velvety, creamy starch sauce.",
    ingredients: [
      "arborio rice",
      "vegetable broth",
      "white wine",
      "butter",
      "parmesan cheese",
      "onions",
      "olive oil"
    ],
    detailedIngredients: [
      { name: "Arborio Rice", amount: "1.5 cups" },
      { name: "Vegetable Broth (warm)", amount: "5 cups" },
      { name: "White Wine (dry)", amount: "1/2 cup" },
      { name: "Unsalted Butter", amount: "2 tablespoons" },
      { name: "Parmesan Cheese (grated)", amount: "1/2 cup" },
      { name: "Onion (finely chopped)", amount: "1 small" },
      { name: "Olive Oil", amount: "2 tablespoons" }
    ],
    procedure: [
      "In a saucepan, bring vegetable broth to a steady simmer.",
      "In a heavy pot, heat olive oil and sauté finely chopped onions until soft.",
      "Add Arborio rice, stirring constantly for 2 minutes to toast the grains.",
      "Pour in the white wine and cook until absorbed.",
      "Add warm broth, one ladle at a time, stirring continuously, waiting until it's absorbed before adding more.",
      "Once rice is tender and creamy (about 18-20 minutes), stir in butter and Parmesan cheese; remove from heat."
    ],
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/GJ_lGFVyecM",
    youtubeVideoId: "GJ_lGFVyecM",
    nutrition: {
      calories: "320 kcal",
      protein: "7g",
      carbs: "48g",
      fat: "11g",
      impact: "Provides steady, slow-releasing energy from short-grain rice. Extremely easy to digest."
    }
  },
  {
    id: "it-bruschetta",
    name: "Italian Tomato Garlic Bruschetta",
    culture: "Italian",
    category: "Supper",
    story: "Bruschetta originated in Italy during the 15th century. It is a simple, vibrant appetizer designed to showcase the fresh flavors of raw tomatoes, sweet basil, garlic, and olive oil.",
    ingredients: [
      "italian bread",
      "garlic cloves",
      "roma tomatoes",
      "olive oil",
      "fresh basil",
      "salt"
    ],
    detailedIngredients: [
      { name: "Italian Crusty Bread", amount: "1 loaf" },
      { name: "Garlic Cloves (halved)", amount: "2" },
      { name: "Roma Tomatoes (diced)", amount: "4" },
      { name: "Extra Virgin Olive Oil", amount: "3 tablespoons" },
      { name: "Fresh Basil Leaves", amount: "1/4 cup chopped" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Slice the bread into thick pieces and toast on a grill or griddle until crispy and golden.",
      "Cut garlic cloves in half and rub the cut side firmly over the toasted bread slices.",
      "In a bowl, mix diced tomatoes, chopped fresh basil, olive oil, and salt.",
      "Spoon the seasoned tomato mixture generously onto each toasted bread slice.",
      "Drizzle with a tiny bit of extra virgin olive oil or balsamic glaze and serve immediately."
    ],
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/Q3xg35pcLyo",
    youtubeVideoId: "Q3xg35pcLyo",
    nutrition: {
      calories: "180 kcal",
      protein: "4g",
      carbs: "22g",
      fat: "8g",
      impact: "Low calorie, rich in lycopene from tomatoes and healthy monounsaturated fats from olive oil."
    }
  },
  {
    id: "it-pizza",
    name: "Classic Margherita Pizza",
    culture: "Italian",
    category: "Lunch",
    story: "Margherita pizza was created in Naples in honor of Queen Margherita of Savoy. The red tomatoes, white mozzarella, and green basil represent the Italian flag.",
    ingredients: [
      "pizza dough",
      "roma tomatoes",
      "mozzarella cheese",
      "olive oil",
      "fresh basil",
      "salt"
    ],
    detailedIngredients: [
      { name: "Prepared Pizza Dough", amount: "1 portion" },
      { name: "Roma Tomatoes (pureed)", amount: "3 medium" },
      { name: "Fresh Mozzarella (sliced)", amount: "200g" },
      { name: "Extra Virgin Olive Oil", amount: "2 tablespoons" },
      { name: "Fresh Basil Leaves", amount: "1/2 cup" },
      { name: "Salt", amount: "To taste" }
    ],
    procedure: [
      "Preheat your oven to the highest setting, ideally 500°F (260°C).",
      "Roll out the pizza dough on a floured surface to form a 12-inch circle.",
      "Spread blended tomato sauce or sliced roma tomatoes evenly over the dough, leaving a small border.",
      "Distribute sliced fresh mozzarella cheese over the tomato base.",
      "Drizzle with olive oil and bake for 10-12 minutes until the crust is golden and cheese is bubbly.",
      "Garnish immediately with fresh basil leaves, slice, and serve."
    ],
    image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/vcfNpDtVqOw",
    youtubeVideoId: "vcfNpDtVqOw",
    nutrition: {
      calories: "310 kcal per slice",
      protein: "12g",
      carbs: "38g",
      fat: "12g",
      impact: "Provides a balanced mix of carbs, fats, and protein. Calcium rich from fresh cheese."
    }
  },
  {
    id: "as-fried-rice",
    name: "Szechuan Vegetable Fried Rice",
    culture: "Asian",
    category: "Lunch",
    story: "Fried Rice originated in Sui Dynasty China as a clever method to avoid wasting leftover rice. Wok-frying seals the grains and brings out a smoky aroma known as wok hei.",
    ingredients: [
      "long-grain parboiled rice",
      "soy sauce",
      "sesame oil",
      "scallions",
      "garlic",
      "carrots",
      "green peas",
      "eggs"
    ],
    detailedIngredients: [
      { name: "Long-grain Parboiled Rice (cooked, cold)", amount: "3 cups" },
      { name: "Soy Sauce", amount: "3 tablespoons" },
      { name: "Sesame Oil", amount: "1 tablespoon" },
      { name: "Green Scallions (chopped)", amount: "1/2 cup" },
      { name: "Garlic Cloves (minced)", amount: "2" },
      { name: "Carrots (diced)", amount: "1/2 cup" },
      { name: "Green Peas", amount: "1/2 cup" },
      { name: "Eggs (beaten)", amount: "2 large" }
    ],
    procedure: [
      "Beat eggs in a bowl and scramble in a hot wok with oil; remove and set aside.",
      "Add a bit more oil to the wok and sauté minced garlic, diced carrots, and peas for 3 minutes.",
      "Add cold cooked rice, breaking up clumps, and stir-fry on high heat for 3-4 minutes.",
      "Stir in the scrambled eggs, soy sauce, and sesame oil, tossing constantly.",
      "Garnish with chopped green scallions and serve hot."
    ],
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/vxltEx-6IkA",
    youtubeVideoId: "vxltEx-6IkA",
    nutrition: {
      calories: "340 kcal",
      protein: "8g",
      carbs: "56g",
      fat: "9g",
      impact: "Rich in vitamins from carrots and peas. Quick digestible carbohydrates for rapid energy loading."
    }
  },
  {
    id: "as-baobuns",
    name: "Traditional Steamed Bao Buns",
    culture: "Asian",
    category: "Supper",
    story: "Bao buns (Gua Bao) are a classic street food snack from Fujian, China. The fluffy steamed dough acts as a pocket for delicious savory fillings.",
    ingredients: [
      "all-purpose flour",
      "active dry yeast",
      "soy sauce",
      "chicken breast",
      "green onions",
      "garlic",
      "cabbage"
    ],
    detailedIngredients: [
      { name: "All-purpose Flour", amount: "3 cups" },
      { name: "Active Dry Yeast", amount: "1 teaspoon" },
      { name: "Soy Sauce", amount: "2 tablespoons" },
      { name: "Chicken Breast (diced)", amount: "300g" },
      { name: "Green Onions (chopped)", amount: "1/2 cup" },
      { name: "Garlic Cloves (minced)", amount: "2" },
      { name: "Cabbage (shredded)", amount: "1 cup" }
    ],
    procedure: [
      "Mix flour, yeast, sugar, and warm water. Knead into a smooth dough and let rise for 1 hour.",
      "Sauté chicken, garlic, green onions, and shredded cabbage in soy sauce until cooked.",
      "Punch down dough, roll into small circles, fold in half with parchment paper in between.",
      "Steam the empty buns in a bamboo steamer for 15 minutes.",
      "Open the steamed buns and fill them with the cooked chicken mixture. Serve warm."
    ],
    image: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/Ui_rOkM0bAk",
    youtubeVideoId: "Ui_rOkM0bAk",
    nutrition: {
      calories: "280 kcal per bun",
      protein: "12g",
      carbs: "42g",
      fat: "5g",
      impact: "Low fat, high energy snack. Fluffy yeast dough is very gentle on the stomach."
    }
  },
  {
    id: "as-noodles",
    name: "Spicy Szechuan Noodles",
    culture: "Asian",
    category: "Lunch",
    story: "Szechuan noodles are famous for their bold, tongue-numbing heat. They are a staple street food across Chengdu and Chongqing, highlighting chili oil and garlic.",
    ingredients: [
      "wheat noodles",
      "soy sauce",
      "sesame oil",
      "garlic",
      "chili paste",
      "scallions",
      "peanuts"
    ],
    detailedIngredients: [
      { name: "Wheat Noodles", amount: "200g" },
      { name: "Soy Sauce", amount: "2 tablespoons" },
      { name: "Sesame Oil", amount: "1 tablespoon" },
      { name: "Garlic Cloves (minced)", amount: "3" },
      { name: "Szechuan Chili Paste", amount: "1.5 tablespoons" },
      { name: "Green Scallions (chopped)", amount: "1/4 cup" },
      { name: "Roasted Peanuts (crushed)", amount: "2 tablespoons" }
    ],
    procedure: [
      "Cook noodles in boiling water according to package directions; drain and rinse.",
      "In a small bowl, whisk together soy sauce, sesame oil, chili paste, and minced garlic.",
      "Toss the warm noodles thoroughly in the sauce until evenly coated.",
      "Serve warm or cold, garnished with chopped scallions and crushed roasted peanuts on top."
    ],
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://www.youtube.com/embed/4tTYIU-hRX0",
    youtubeVideoId: "4tTYIU-hRX0",
    nutrition: {
      calories: "360 kcal",
      protein: "9g",
      carbs: "58g",
      fat: "10g",
      impact: "Garlic and chili oil boost metabolism and support circulatory health."
    }
  },
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
,
  {
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
  }
,
  {
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
    videoUrl: "https://www.youtube.com/embed/JzsNQOwI-sA",
    youtubeVideoId: "JzsNQOwI-sA",
    nutrition: {
      calories: "310 kcal",
      protein: "8g",
      carbs: "54g",
      fat: "5g",
      impact: "High in beta-glucan soluble fiber for heart health and sustained morning energy release."
    }
  }
];

const LOCALIZATIONS = {
  substitutions: {
    "Cilantro": [
      { market: "Nigerian Local Markets", substitute: "Efinrin (Scent Leaf) or Fresh Curry Leaves" },
      { market: "General Western Markets", substitute: "Fresh Coriander or Flat-leaf Parsley" }
    ],
    "Oaxaca Cheese (or Mozzarella)": [
      { market: "Nigerian Local Markets", substitute: "Wara (local unripened cheese) or Mozzarella" },
      { market: "General Western Markets", substitute: "Mozzarella or Monterey Jack" }
    ],
    "Scotch Bonnet Peppers": [
      { market: "Brazilian Local Markets", substitute: "Pimenta-biquinho or Dedo-de-moça" },
      { market: "General Western Markets", substitute: "Habanero Peppers" }
    ],
    "Tapioca Starch (Sour/Sweet)": [
      { market: "Nigerian Local Markets", substitute: "Cassava Flour (Fufu/Garri starch)" },
      { market: "General Western Markets", substitute: "Tapioca Flour or Arrowroot powder" }
    ],
    "Palm Oil": [
      { market: "General Western/European Markets", substitute: "Achiote oil or Vegetable oil with a pinch of paprika" }
    ],
    "Carne Seca (or Beef Chuck)": [
      { market: "General Western/European/Nigerian Markets", substitute: "Smoked beef brisket or Corned Beef chuck" }
    ],
    "Paio Sausage (or Chorizo)": [
      { market: "General Western/European/Nigerian Markets", substitute: "Chorizo or Kielbasa sausage" }
    ],
    "Locust Beans (Iru)": [
      { market: "General Western/European Markets", substitute: "Fermented black beans or Miso paste" }
    ],
    "Egusi Seeds (Melon)": [
      { market: "General Western/European Markets", substitute: "Pumpkin seeds (pepitas) ground into a paste" }
    ]
  },
  
  conversions: {
    gToOz: 0.035274,
    mlToFlOz: 0.033814,
    kgToLbs: 2.20462
  }
};

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = { RECIPES };
}
