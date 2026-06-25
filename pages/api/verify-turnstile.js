export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return res.status(500).json({ success: false, error: "Server misconfigured" });
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);

    const verifyRes = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: formData }
    );

    const data = await verifyRes.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    }
    return res.status(400).json({ success: false, error: data["error-codes"]?.join(", ") || "Verification failed" });
  } catch {
    return res.status(500).json({ success: false, error: "Verification request failed" });
  }
}
