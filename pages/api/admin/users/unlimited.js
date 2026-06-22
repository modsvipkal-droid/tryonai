import { findUserByEmail, updateUser, insertActivation } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, value } = req.body || {};
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await updateUser(email, {
      unlimited: !!value,
      unlimitedAt: value ? Date.now() : null,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (value) {
      await insertActivation({ email, activatedAt: Date.now() });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Admin toggle unlimited error:", error);
    return res.status(200).json({ error: "Failed to toggle unlimited" });
  }
}
