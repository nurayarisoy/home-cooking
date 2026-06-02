import { getDb } from "../../lib/db";
import { getMongoDb, isMongoConfigured, nextSequence } from "../../lib/mongo";
import { getSessionUserFromRequest } from "../../lib/session";
import { dispatchRecipeForSocial } from "../../lib/socialDispatch";
import fs from "node:fs/promises";
import path from "node:path";

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

function toUploadsFilePath(mediaUrl) {
  const raw = String(mediaUrl || "").trim();
  if (!raw || raw.startsWith("data:")) {
    return null;
  }

  try {
    const parsed = new URL(raw, "https://home-cooking.local");
    const pathname = parsed.pathname || "";
    if (!pathname.startsWith("/uploads/")) {
      return null;
    }

    const fileName = path.basename(decodeURIComponent(pathname));
    if (!fileName || fileName === "." || fileName === "..") {
      return null;
    }

    return path.join(process.cwd(), "public", "uploads", fileName);
  } catch {
    return null;
  }
}

async function removeLocalUploadFile(mediaUrl) {
  const filePath = toUploadsFilePath(mediaUrl);
  if (!filePath) {
    return;
  }

  try {
    await fs.unlink(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      console.error("Media cleanup error:", error);
    }
  }
}

export default async function handler(req, res) {
  try {
    const sessionUser = getSessionUserFromRequest(req);
    if (req.method !== "GET" && !sessionUser) {
      return res.status(401).json({ message: "Du musst angemeldet sein, um Rezepte zu veröffentlichen. Bitte melde dich an." });
    }

    if (isMongoConfigured()) {
      const mongoDb = await getMongoDb();
      const recipesCollection = mongoDb.collection("recipes");

      if (req.method === "GET") {
        const query = req.query?.all === "1" ? {} : { published: 1 };
        const recipes = await recipesCollection
          .find(query, { projection: { _id: 0 } })
          .sort({ id: -1 })
          .toArray();
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
        const authorEmail = sessionUser?.email || null;
        const published = normalizePublished(req.body?.published);

        if (!title || !description) {
          return res.status(400).json({
            message: "Title and instructions are required.",
          });
        }

        if (published === 1 && authorEmail) {
          const count = await recipesCollection.countDocuments({
            author_email: authorEmail,
            published: 1,
          });
          if (count >= PUBLISH_QUOTA) {
            return res.status(429).json({
              message: `Du hast dein Veröffentlichungs-Limit erreicht (${PUBLISH_QUOTA} Rezepte). Lege eines als Entwurf ab und versuche es erneut.`,
            });
          }
        }

        const id = await nextSequence("recipes");
        await recipesCollection.insertOne({
          id,
          title,
          description,
          ingredients_text: ingredientsText || null,
          instructions_text: instructionsText || null,
          media_name: mediaName,
          media_url: mediaUrl,
          media_type: mediaType,
          published,
          author_email: authorEmail,
          created_at: new Date().toISOString(),
        });

        let socialDispatch = { dispatched: false, reason: "not-published" };
        if (published === 1) {
          try {
            socialDispatch = await dispatchRecipeForSocial({
              action: "created",
              authorEmail,
              platforms: req.body?.socialPlatforms,
              recipe: {
                id,
                title,
                ingredientsText,
                instructionsText,
                mediaUrl,
                mediaType,
                createdAt: new Date().toISOString(),
              },
            });
          } catch (error) {
            console.error("Social dispatch error (create):", error);
            socialDispatch = { dispatched: false, reason: "dispatch-failed" };
          }
        }

        return res.status(201).json({
          message: "Recipe created successfully.",
          id,
          socialDispatch,
        });
      }

      if (req.method === "PUT") {
        const id = Number(req.body?.id);
        if (!Number.isInteger(id) || id <= 0) {
          return res.status(400).json({ message: "Valid recipe id is required." });
        }

        const existingRecipe = await recipesCollection.findOne(
          { id },
          { projection: { _id: 0, media_url: 1, published: 1, created_at: 1 } }
        );
        if (!existingRecipe) {
          return res.status(404).json({ message: "Recipe not found." });
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
          const authorEmail = sessionUser?.email || null;
          if (authorEmail) {
            const count = await recipesCollection.countDocuments({
              author_email: authorEmail,
              published: 1,
              id: { $ne: id },
            });
            if (count >= PUBLISH_QUOTA) {
              return res.status(429).json({
                message: `Du hast dein Veröffentlichungs-Limit erreicht (${PUBLISH_QUOTA} Rezepte). Lege eines als Entwurf ab und versuche es erneut.`,
              });
            }
          }
        }

        const result = await recipesCollection.updateOne(
          { id },
          {
            $set: {
              title,
              description,
              ingredients_text: ingredientsText || null,
              instructions_text: instructionsText || null,
              media_name: mediaName,
              media_url: mediaUrl,
              media_type: mediaType,
              published,
            },
          }
        );

        if (!result.matchedCount) {
          return res.status(404).json({ message: "Recipe not found." });
        }

        if (existingRecipe.media_url && existingRecipe.media_url !== mediaUrl) {
          const remaining = await recipesCollection.countDocuments({
            media_url: existingRecipe.media_url,
            id: { $ne: id },
          });
          if (remaining === 0) {
            await removeLocalUploadFile(existingRecipe.media_url);
          }
        }

        let socialDispatch = { dispatched: false, reason: "not-published" };
        if (published === 1 && Number(existingRecipe.published || 0) !== 1) {
          try {
            socialDispatch = await dispatchRecipeForSocial({
              action: "published",
              authorEmail: sessionUser?.email || null,
              platforms: req.body?.socialPlatforms,
              recipe: {
                id,
                title,
                ingredientsText,
                instructionsText,
                mediaUrl,
                mediaType,
                createdAt: existingRecipe.created_at || null,
              },
            });
          } catch (error) {
            console.error("Social dispatch error (publish):", error);
            socialDispatch = { dispatched: false, reason: "dispatch-failed" };
          }
        }

        return res.status(200).json({
          message: "Recipe updated successfully.",
          socialDispatch,
        });
      }

      if (req.method === "DELETE") {
        const id = Number(req.query?.id || req.body?.id);
        if (!Number.isInteger(id) || id <= 0) {
          return res.status(400).json({ message: "Valid recipe id is required." });
        }

        const existingRecipe = await recipesCollection.findOne(
          { id },
          { projection: { _id: 0, media_url: 1 } }
        );
        if (!existingRecipe) {
          return res.status(404).json({ message: "Recipe not found." });
        }

        const result = await recipesCollection.deleteOne({ id });
        if (!result.deletedCount) {
          return res.status(404).json({ message: "Recipe not found." });
        }

        if (existingRecipe.media_url) {
          const remaining = await recipesCollection.countDocuments({
            media_url: existingRecipe.media_url,
          });
          if (remaining === 0) {
            await removeLocalUploadFile(existingRecipe.media_url);
          }
        }

        return res.status(200).json({ message: "Recipe deleted successfully." });
      }

      return res.status(405).json({ message: "Method not allowed" });
    }

    const db = await getDb();

    if (req.method === "GET") {
      const showAll = req.query?.all === "1";
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
          ${showAll ? "" : "WHERE published = 1"}
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
      const authorEmail = sessionUser?.email || null;
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
            message: `Du hast dein Veröffentlichungs-Limit erreicht (${PUBLISH_QUOTA} Rezepte). Lege eines als Entwurf ab und versuche es erneut.`,
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

      let socialDispatch = { dispatched: false, reason: "not-published" };
      if (published === 1) {
        try {
          socialDispatch = await dispatchRecipeForSocial({
            action: "created",
            authorEmail,
            platforms: req.body?.socialPlatforms,
            recipe: {
              id: result.lastID,
              title,
              ingredientsText,
              instructionsText,
              mediaUrl,
              mediaType,
              createdAt: new Date().toISOString(),
            },
          });
        } catch (error) {
          console.error("Social dispatch error (create):", error);
          socialDispatch = { dispatched: false, reason: "dispatch-failed" };
        }
      }

      return res.status(201).json({
        message: "Recipe created successfully.",
        id: result.lastID,
        socialDispatch,
      });
    }

    if (req.method === "PUT") {
      const id = Number(req.body?.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Valid recipe id is required." });
      }

      const existingRecipe = await db.get(
        `SELECT media_url, published, created_at FROM recipes WHERE id = ?`,
        id
      );
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found." });
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
        const authorEmail = sessionUser?.email || null;
        if (authorEmail) {
          const { count } = await db.get(
            `SELECT COUNT(*) AS count FROM recipes WHERE author_email = ? AND published = 1 AND id != ?`,
            authorEmail,
            id
          );
          if (count >= PUBLISH_QUOTA) {
            return res.status(429).json({
              message: `Du hast dein Veröffentlichungs-Limit erreicht (${PUBLISH_QUOTA} Rezepte). Lege eines als Entwurf ab und versuche es erneut.`,
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

      if (existingRecipe.media_url && existingRecipe.media_url !== mediaUrl) {
        const { count } = await db.get(
          `SELECT COUNT(*) AS count FROM recipes WHERE media_url = ? AND id != ?`,
          existingRecipe.media_url,
          id
        );
        if (count === 0) {
          await removeLocalUploadFile(existingRecipe.media_url);
        }
      }

      let socialDispatch = { dispatched: false, reason: "not-published" };
      if (published === 1 && Number(existingRecipe.published || 0) !== 1) {
        try {
          socialDispatch = await dispatchRecipeForSocial({
            action: "published",
            authorEmail: sessionUser?.email || null,
            platforms: req.body?.socialPlatforms,
            recipe: {
              id,
              title,
              ingredientsText,
              instructionsText,
              mediaUrl,
              mediaType,
              createdAt: existingRecipe.created_at || null,
            },
          });
        } catch (error) {
          console.error("Social dispatch error (publish):", error);
          socialDispatch = { dispatched: false, reason: "dispatch-failed" };
        }
      }

      return res.status(200).json({
        message: "Recipe updated successfully.",
        socialDispatch,
      });
    }

    if (req.method === "DELETE") {
      const id = Number(req.query?.id || req.body?.id);
      if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({ message: "Valid recipe id is required." });
      }

      const existingRecipe = await db.get(
        `SELECT media_url FROM recipes WHERE id = ?`,
        id
      );
      if (!existingRecipe) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      const result = await db.run(`DELETE FROM recipes WHERE id = ?`, id);
      if (!result.changes) {
        return res.status(404).json({ message: "Recipe not found." });
      }

      if (existingRecipe.media_url) {
        const { count } = await db.get(
          `SELECT COUNT(*) AS count FROM recipes WHERE media_url = ?`,
          existingRecipe.media_url
        );
        if (count === 0) {
          await removeLocalUploadFile(existingRecipe.media_url);
        }
      }

      return res.status(200).json({ message: "Recipe deleted successfully." });
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (error) {
    console.error("Recipes API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
