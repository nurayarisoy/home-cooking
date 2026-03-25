import { getDb } from "../../lib/db";
import { verifyPassword } from "../../lib/auth";
import { getMongoDb, isMongoConfigured } from "../../lib/mongo";
import { setSessionCookie } from "../../lib/session";

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

    let user;
    if (isMongoConfigured()) {
      const db = await getMongoDb();
      user = await db
        .collection("users")
        .findOne(
          { email },
          {
            projection: {
              _id: 0,
              id: 1,
              username: 1,
              email: 1,
              password_hash: 1,
              password_salt: 1,
            },
          }
        );
    } else {
      const db = await getDb();
      user = await db.get(
        "SELECT id, username, email, password_hash, password_salt FROM users WHERE email = ?",
        email
      );
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const validPassword = verifyPassword(password, user.password_salt, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    setSessionCookie(res, {
      id: user.id,
      username: user.username,
      email: user.email,
    });

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
