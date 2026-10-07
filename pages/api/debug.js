export default async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).end();
  }

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const hasUri = !!process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || "kalmods21_db (default)";
  return res.status(200).json({
    MONGODB_URI: hasUri ? "✓ set" : "✗ NOT SET",
    MONGODB_DB: dbName,
  });
}
