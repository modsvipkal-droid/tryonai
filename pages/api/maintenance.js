import { getMaintenance } from "@/lib/db";
import { createRateLimiter } from "@/lib/rateLimit";

const limiter = createRateLimiter({ windowMs: 1000, max: 10, name: "maintenance" });

export default async function handler(req, res) {
  const { limited } = limiter(req, res);
  if (limited) {
    return res.status(429).json({ error: "Too many requests" });
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const config = await getMaintenance();
    return res.status(200).json(config);
  } catch {
    return res.status(200).json({ enabled: false, title: "", message: "", eta: "" });
  }
}
