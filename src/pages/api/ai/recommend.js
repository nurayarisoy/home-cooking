function toTitleCase(value) {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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

  if (ingredients.length === 0) {
    return res.status(400).json({ message: "Please provide at least one ingredient." });
  }

  const leadIngredient = toTitleCase(ingredients[0]);
  const recipeName = `${leadIngredient} Pan Delight`;

  const recipe = {
    name: recipeName,
    image: null,
    ingredients: [...ingredients, "salt", "black pepper", "olive oil"],
    instructions:
      "Heat a pan over medium heat, add olive oil, and cook your ingredients in stages. Season with salt and black pepper, stir for 8-10 minutes, and serve warm.",
  };

  return res.status(200).json({
    suggestion: `Try cooking a quick ${recipeName} with your selected ingredients.`,
    recipe,
  });
}
