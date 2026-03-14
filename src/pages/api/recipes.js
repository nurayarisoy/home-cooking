import { getDb } from "../../lib/db";

const PUBLISH_QUOTA = 10;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "25mb",
    },
  },
};

function normalizeText(value) {
  return String(value || "").trim();
}

function normalizePublished(value) {
  return value === true || value === 1 || value === "1" ? 1 : 0;
}

function toMediaName(mediaUrl) {
  if (!mediaUrl) return null;
  if (mediaUrl.startsWith("data:")) {
    return "inline-media";
  }
  try {
    const withoutQuery = mediaUrl.split(/[?#]/)[0];
    const parts = withoutQuery.split("/").filter(Boolean);
    return parts.length ? parts[parts.length - 1] : null;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const db = await getDb();

    if (req.method === "GET") {
      const recipes = await db.all(
        `
          SELECT
            id,
            title,
            description,
            ingredients_text,
            instructions_text,
            media_name,
            media_url,
            media_type,
            published,
            author_email,
            created_at
          FROM recipes
          ORDER BY id DESC
        `
      );
      return res.status(200).json(recipes);
    }

    if (req.method === "POST") {
      const title = normalizeText(req.body?.title);
      const ingredientsText = normalizeText(req.body?.ingredientsText);
      const instructionsText = normalizeText(req.body?.instructionsText);
      const legacyDescription = normalizeText(req.body?.description);
      const description = instructionsText || legacyDescription;
      const mediaUrl = normalizeText(req.body?.mediaUrl) || null;
      const mediaType = normalizeText(req.body?.mediaType) || null;
      const mediaName = req.body?.mediaName
        ? String(req.body.mediaName)
        : toMediaName(mediaUrl);
      const authorEmail = req.body?.authorEmail ? normalizeText(req.body.authorEmail) : null;
      const published = normalizePublished(req.body?.published);

      if (!title || !description) {
        return res.status(400).json({
          message: "Title and instructions are required.",
        });
      }

      if (published === 1 && authorEmail) {
        const { count } = await db.get(
          `SELECT COUNT(*) AS count FROM recipes WHERE author_email = ? AND published = 1`,
          authorEmail
        );
        if (count >= PUBLISH_QUOTA) {
          return res.status(429).json({
            message: `Yayinlama kotaniza ulastiniz (${PUBLISH_QUOTA} tarif). Birini taslaga alip tekrar deneyin.`,
          });
        }
      }

      const result = await db.run(
        `
          INSERT INTO recipes (
            title,
            description,
            ingredients_text,
            instructions_text,
            media_name,
            media_url,
            media_type,
            published,
            author_email
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        title,
        description,
        ingredientsText || null,
        instructionsText || null,
        mediaName,
        mediaUrl,
        mediaType,
        published,
        authorEmail
      );

      return res.status(201).json({
        message: "Recipe created successfully.",
        id: result.lastID,
      });
    }

    if (req.method === "PUT") {
      const id = Number(req.body?.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Valid recipe id is required." });
      }

      const title = normalizeText(req.body?.title);
      const ingredientsText = normalizeText(req.body?.ingredientsText);
      const instructionsText = normalizeText(req.body?.instructionsText);
      const mediaUrl = normalizeText(req.body?.mediaUrl) || null;
      const mediaType = normalizeText(req.body?.mediaType) || null;
      const mediaName = req.body?.mediaName
        ? String(req.body.mediaName)
        : toMediaName(mediaUrl);
      const published = normalizePublished(req.body?.published);
      const description = instructionsText;

      if (!title || !description) {
        return res.status(400).json({
          message: "Title and instructions are required.",
        });
      }

      if (published === 1) {
        const authorEmail = req.body?.authorEmail
          ? normalizeText(req.body.authorEmail)
          : null;
        if (authorEmail) {
          const { count } = await db.get(
            `SELECT COUNT(*) AS count FROM recipes WHERE author_email = ? AND published = 1 AND id != ?`,
            authorEmail,
            id
          );
          if (count >= PUBLISH_QUOTA) {
            return res.status(429).json({
              message: `Yayinlama kotaniza ulastiniz (${PUBLISH_QUOTA} tarif). Birini taslaga alip tekrar deneyin.`,
            });
          }
        }
      }

      const result = await db.run(
        `
          UPDATE recipes
          SET
            title = ?,
            description = ?,
            ingredients_text = ?,
            instructions_text = ?,
            media_name = ?,
            media_url = ?,
            media_type = ?,
            published = ?
          WHERE id = ?
        `,
        title,
        description,
        ingredientsText || null,
        instructionsText || null,
        mediaName,
        mediaUrl,
        mediaType,
        published,
        id
      );

      if (!result.changes) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      return res.status(200).json({ message: "Recipe updated successfully." });
    }

    if (req.method === "DELETE") {
      const id = Number(req.query?.id || req.body?.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Valid recipe id is required." });
      }

      const result = await db.run(`DELETE FROM recipes WHERE id = ?`, id);
      if (!result.changes) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      return res.status(200).json({ message: "Recipe deleted successfully." });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Recipes API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
