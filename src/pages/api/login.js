import { getDb } from "../../lib/db";
import { verifyPassword } from "../../lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = String(req.body?.password || "");

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const db = await getDb();
    const user = await db.get(
      "SELECT id, username, email, password_hash, password_salt FROM users WHERE email = ?",
      email
    );

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const validPassword = verifyPassword(password, user.password_salt, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    return res.status(200).json({
      message: "Login successful.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
