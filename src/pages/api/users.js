import { getDb } from "../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const db = await getDb();
    const rows = await db.all(
      `
        SELECT id, username, location_lat, location_lng
        FROM users
        WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL
      `
    );

    const users = rows.map((row) => ({
      _id: row.id,
      username: row.username,
      location: {
        latitude: row.location_lat,
        longitude: row.location_lng,
      },
    }));

    return res.status(200).json(users);
  } catch (error) {
    console.error("Users API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
