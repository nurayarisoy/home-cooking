const MAX_INGREDIENTS = 12;
const MAX_INGREDIENT_LENGTH = 60;
const ALLOWED_INGREDIENT_RE = /^[\p{L}\p{N}\s\-',.()]+$/u;

const allowedDietTags = new Set(["high-protein", "vegetarian", "quick-meal", "low-carb"]);

function toTitleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

function sanitizeIngredient(raw) {
  const trimmed = String(raw || "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_INGREDIENT_LENGTH);

  return ALLOWED_INGREDIENT_RE.test(trimmed) ? trimmed : null;
}

const RECIPE_STYLES = {
  "vegetarian+high-protein": "Garden Protein",
  vegetarian: "Garden",
  "high-protein": "Power",
  "low-carb": "Light",
  default: "Home",
};

const SKILLET_VARIANTS = ["Skillet", "Bowl", "Pan", "Plate", "Mix"];

function pickVariant(leadIngredient) {
  const code = leadIngredient
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return SKILLET_VARIANTS[code % SKILLET_VARIANTS.length];
}

function validateAndBuildResponse({ ingredients, diets, servings }) {
  const errors = [];

  if (ingredients.length === 0) {
    errors.push("Please provide at least one ingredient.");
  }

  if (ingredients.length > MAX_INGREDIENTS) {
    errors.push(`Maximum ${MAX_INGREDIENTS} ingredients allowed.`);
  }

  const badIngredients = ingredients.filter((item) => !sanitizeIngredient(item));
  if (badIngredients.length > 0) {
    errors.push(`Invalid ingredient(s): ${badIngredients.slice(0, 3).join(", ")}.`);
  }

  return errors;
}

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

function normalizeAvoids(value) {
  if (!Array.isArray(value)) return [];

  return [...new Set(value.map((item) => sanitizeIngredient(item)).filter(Boolean))].slice(
    0,
    MAX_INGREDIENTS
  );
}

function buildRecipeStyle(diets) {
  if (diets.includes("vegetarian") && diets.includes("high-protein")) {
    return RECIPE_STYLES["vegetarian+high-protein"];
  }
  for (const key of Object.keys(RECIPE_STYLES)) {
    if (key !== "default" && key !== "vegetarian+high-protein" && diets.includes(key)) {
      return RECIPE_STYLES[key];
    }
  }
  return RECIPE_STYLES.default;
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

  const rawIngredients = Array.isArray(req.body?.ingredients)
    ? req.body.ingredients
    : [];

  const ingredients = rawIngredients
    .map((item) => sanitizeIngredient(item))
    .filter(Boolean)
    .slice(0, MAX_INGREDIENTS);

  const diets = normalizeDiets(req.body?.preferences?.diets);
  const avoids = normalizeAvoids(req.body?.preferences?.avoids);
  const servings = getSafeServings(req.body?.preferences?.servings);

  const errors = validateAndBuildResponse({ ingredients, diets, servings });
  if (errors.length > 0) {
    return res.status(400).json({ message: errors[0] });
  }

  let leadIngredient;
  let recipeName;
  try {
    leadIngredient = toTitleCase(ingredients[0]);
    const recipeStyle = buildRecipeStyle(diets);
    const variant = pickVariant(leadIngredient);
    recipeName = `${recipeStyle} ${leadIngredient} ${variant}`;
  } catch {
    leadIngredient = "Ingredient";
    recipeName = "Home Cooking Special";
  }

  let mergedIngredients;
  let instructions;
  try {
    const additions = buildAdditionalIngredients(diets, servings);
    mergedIngredients = [...new Set([...ingredients, ...additions])].filter(
      (item) => !avoids.includes(item)
    );
    instructions = buildInstructions({ leadIngredient, servings, diets });
  } catch {
    mergedIngredients = ingredients.filter((item) => !avoids.includes(item));
    instructions = `Combine your ingredients and cook on medium heat for 15 minutes. Season to taste and serve warm for ${servings} ${servings === 1 ? "person" : "people"}.`;
  }

  if (!recipeName || !instructions || mergedIngredients.length === 0) {
    return res.status(500).json({ message: "Could not generate a recipe. Please try different ingredients." });
  }

  const dietSummary = diets.length > 0 ? ` (${diets.join(", ")})` : "";
  const avoidSummary = avoids.length > 0 ? ` without ${avoids.slice(0, 3).join(", ")}` : "";

  const recipe = {
    name: recipeName,
    image: null,
    ingredients: mergedIngredients,
    instructions,
  };

  return res.status(200).json({
    suggestion: `Try a ${servings}-serving ${recipeName}${dietSummary}${avoidSummary} with your selected ingredients.`,
    recipe,
  });
}
