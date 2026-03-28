import { getDb } from "../../lib/db";
import { getMongoDb, isMongoConfigured } from "../../lib/mongo";

const ALLOWED_VOTES = new Set(["up", "down"]);

function sanitizeText(value, maxLength = 500) {
  return String(value || "").trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const vote = sanitizeText(req.body?.vote, 10).toLowerCase();
  if (!ALLOWED_VOTES.has(vote)) {
    return res.status(400).json({ message: "vote must be 'up' or 'down'." });
  }

  const recipeName = sanitizeText(req.body?.recipeName);
  const ingredients = sanitizeText(
    Array.isArray(req.body?.ingredients)
      ? req.body.ingredients.join(", ")
      : req.body?.ingredients
  );
  const diets = sanitizeText(
    Array.isArray(req.body?.diets)
      ? req.body.diets.join(", ")
      : req.body?.diets
  );
  const servings = Number.isFinite(Number(req.body?.servings))
    ? Math.min(6, Math.max(1, Number(req.body.servings)))
    : null;

  try {
    if (isMongoConfigured()) {
      const db = await getMongoDb();
      await db.collection("ai_suggestion_feedback").insertOne({
        vote,
        recipe_name: recipeName || null,
        ingredients: ingredients || null,
        diets: diets || null,
        servings,
        created_at: new Date().toISOString(),
      });
    } else {
      const db = await getDb();
      await db.run(
        `INSERT INTO ai_suggestion_feedback
          (vote, recipe_name, ingredients, diets, servings)
         VALUES (?, ?, ?, ?, ?)`,
        vote,
        recipeName || null,
        ingredients || null,
        diets || null,
        servings
      );
    }

    return res.status(201).json({ message: "Feedback recorded. Thank you!" });
  } catch (error) {
    console.error("Feedback API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
