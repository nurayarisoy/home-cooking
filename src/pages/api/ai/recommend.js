function toTitleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

const allowedDietTags = new Set(["high-protein", "vegetarian", "quick-meal", "low-carb"]);

function getSafeServings(value) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (Number.isNaN(parsed)) return 2;
  return Math.min(6, Math.max(1, parsed));
}

function normalizeDiets(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map((item) => String(item).trim().toLowerCase()))].filter((item) =>
    allowedDietTags.has(item)
  );
}

function buildRecipeStyle(diets) {
  if (diets.includes("vegetarian") && diets.includes("high-protein")) {
    return "Garden Protein";
  }
  if (diets.includes("vegetarian")) return "Garden";
  if (diets.includes("high-protein")) return "Power";
  if (diets.includes("low-carb")) return "Light";
  return "Home";
}

function buildAdditionalIngredients(diets, servings) {
  const additions = ["olive oil", "salt", "black pepper"];

  if (diets.includes("high-protein")) {
    additions.push("greek yogurt", "chickpeas");
  }

  if (diets.includes("vegetarian")) {
    additions.push("fresh herbs", "lemon zest");
  }

  if (diets.includes("low-carb")) {
    additions.push("zucchini ribbons", "cauliflower rice");
  } else {
    additions.push("warm flatbread");
  }

  if (servings >= 4) {
    additions.push("extra onion");
  }

  return additions;
}

function buildInstructions({ leadIngredient, servings, diets }) {
  const cookMinutes = diets.includes("quick-meal") ? "8-10" : "14-18";
  const proteinNote = diets.includes("high-protein")
    ? "Fold in chickpeas in the last 3 minutes to keep texture and protein high"
    : "Taste and adjust seasoning before serving";
  const finishNote = diets.includes("vegetarian")
    ? "Finish with chopped herbs and lemon zest for a bright vegetarian finish"
    : "Finish with a spoon of yogurt and a pinch of black pepper";

  return [
    `Heat olive oil in a wide pan on medium heat and add your chopped ingredients, starting with onions and firmer vegetables`,
    `Add ${leadIngredient.toLowerCase()} and cook in stages for ${cookMinutes} minutes, stirring every minute`,
    `${proteinNote}`,
    `${finishNote}`,
    `Serve warm for ${servings} ${servings === 1 ? "person" : "people"}`,
  ].join(". ");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const ingredients = Array.isArray(req.body?.ingredients)
    ? req.body.ingredients
        .map((item) => String(item || "").trim())
        .filter(Boolean)
    : [];
  const diets = normalizeDiets(req.body?.preferences?.diets);
  const servings = getSafeServings(req.body?.preferences?.servings);

  if (ingredients.length === 0) {
    return res.status(400).json({ message: "Please provide at least one ingredient." });
  }

  const leadIngredient = toTitleCase(ingredients[0]);
  const recipeStyle = buildRecipeStyle(diets);
  const recipeName = `${recipeStyle} ${leadIngredient} Skillet`;

  const additions = buildAdditionalIngredients(diets, servings);
  const mergedIngredients = [...new Set([...ingredients, ...additions])];
  const instructions = buildInstructions({ leadIngredient, servings, diets });

  const dietSummary = diets.length > 0 ? ` (${diets.join(", ")})` : "";

  const recipe = {
    name: recipeName,
    image: null,
    ingredients: mergedIngredients,
    instructions,
  };

  return res.status(200).json({
    suggestion: `Try a ${servings}-serving ${recipeName}${dietSummary} with your selected ingredients.`,
    recipe,
  });
}
