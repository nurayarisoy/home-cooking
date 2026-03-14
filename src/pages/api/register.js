import { getDb } from "../../lib/db";
import { hashPassword } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const username = String(req.body?.username || "").trim();
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Username, email and password are required." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const location = req.body?.location;
    const locationLat = Number.isFinite(Number(location?.latitude))
      ? Number(location.latitude)
      : null;
    const locationLng = Number.isFinite(Number(location?.longitude))
      ? Number(location.longitude)
      : null;

    const db = await getDb();
    const existingUser = await db.get("SELECT id FROM users WHERE email = ?", email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exists with this email." });
    }

    const { salt, hash } = hashPassword(password);

    await db.run(
      `
        INSERT INTO users (username, email, password_hash, password_salt, location_lat, location_lng)
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      username,
      email,
      hash,
      salt,
      locationLat,
      locationLng
    );

    return res.status(201).json({ message: "Registration successful." });
  } catch (error) {
    console.error("Register API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
