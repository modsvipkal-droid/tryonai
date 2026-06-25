import { findUserByEmail } from "../../../../lib/db";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const user = await findUserByEmail(email);

    return res.status(200).json({
      unlimited: user?.unlimited || false,
      found: !!user,
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return res.status(200).json({ unlimited: false, found: false });
  }
}
