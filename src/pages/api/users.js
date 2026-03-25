import { getDb } from "../../lib/db";
import { getMongoDb, isMongoConfigured } from "../../lib/mongo";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    let rows;
    if (isMongoConfigured()) {
      const db = await getMongoDb();
      rows = await db
        .collection("users")
        .find(
          {
            location_lat: { $ne: null },
            location_lng: { $ne: null },
          },
          {
            projection: {
              _id: 0,
              id: 1,
              username: 1,
              location_lat: 1,
              location_lng: 1,
            },
          }
        )
        .toArray();
    } else {
      const db = await getDb();
      rows = await db.all(
        `
          SELECT id, username, location_lat, location_lng
          FROM users
          WHERE location_lat IS NOT NULL AND location_lng IS NOT NULL
        `
      );
    }

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
