import { getUsers, findUserByEmail, insertUser } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await getUsers();
      return res.status(200).json({ users });
    } catch (error) {
      console.error("Admin users fetch error:", error.message);
      return res.status(200).json({ users: [] });
    }
  }

  if (req.method === "POST") {
    try {
      const { email, displayName, photoURL } = req.body || {};
      if (!email) {
        return res.status(400).json({ error: "Email is required" });
      }

      const existing = await findUserByEmail(email);
      if (existing) {
        return res.status(200).json({ user: existing });
      }

      const user = {
        email,
        displayName: displayName || email.split("@")[0],
        photoURL: photoURL || "",
        unlimited: false,
        unlimitedAt: null,
        createdAt: Date.now(),
      };

      await insertUser(user);
      return res.status(201).json({ user });
    } catch (error) {
      console.error("Admin users add error:", error.message);
      return res.status(200).json({ user: null, error: error.message });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: "Method not allowed" });
}
