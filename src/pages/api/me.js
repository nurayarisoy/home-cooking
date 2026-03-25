import { getSessionUserFromRequest } from "../../lib/session";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const user = getSessionUserFromRequest(req);
  if (!user) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  return res.status(200).json({ user });
}
