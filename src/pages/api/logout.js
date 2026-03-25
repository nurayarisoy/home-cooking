import { clearSessionCookie } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  clearSessionCookie(res);
  return res.status(200).json({ message: "Logout successful." });
}
