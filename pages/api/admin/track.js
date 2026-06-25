import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), ".data");
const VISITS_FILE = path.join(DB_DIR, "visits.json");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { path: pagePath, referrer, userAgent, isNew } = req.body || {};

    // Device categorization
    let device = "Desktop";
    if (/Mobi|Android|iPhone|iPad/i.test(userAgent)) {
      device = /Tablet|iPad/i.test(userAgent) ? "Tablet" : "Mobile";
    }

    // Browser categorization
    let browser = "Chrome";
    const ua = userAgent || "";
    if (/Firefox/i.test(ua)) {
      browser = "Firefox";
    } else if (/SamsungBrowser/i.test(ua)) {
      browser = "Samsung Internet";
    } else if (/Opera|OPR/i.test(ua)) {
      browser = "Opera";
    } else if (/Edge|Edg/i.test(ua)) {
      browser = "Edge";
    } else if (/Android/i.test(ua) && /Version/i.test(ua)) {
      browser = "Android Webview";
    } else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) {
      browser = "Safari";
    } else if (/Chrome/i.test(ua)) {
      browser = "Chrome";
    }

    // Country detection (IP geoloc fallback or Vercel header)
    const country = req.headers["x-vercel-ip-country"] || "India";

    // Channel/Source detection
    let channel = "Direct";
    let source = "Direct";
    if (referrer) {
      try {
        const refUrl = new URL(referrer);
        const host = refUrl.hostname.toLowerCase();
        
        if (host.includes("google.com")) {
          if (host.includes("accounts.google")) {
            channel = "Referral";
            source = "Google accounts";
          } else {
            channel = "Organic Search";
            source = "Google";
          }
        } else if (host.includes("duckduckgo.com")) {
          channel = "Organic Search";
          source = "DuckDuckGo";
        } else if (host.includes("instagram.com")) {
          channel = "Social Media";
          source = "Instagram";
        } else if (host.includes("facebook.com")) {
          channel = "Social Media";
          source = "Facebook";
        } else {
          channel = "Referral";
          source = refUrl.hostname;
        }
      } catch (err) {
        channel = "Referral";
        source = referrer;
      }
    }

    const visit = {
      timestamp: Date.now(),
      path: pagePath || "/",
      device,
      browser,
      country,
      isNew: !!isNew,
      channel,
      source,
    };

    if (!fs.existsSync(DB_DIR)) {
      fs.mkdirSync(DB_DIR, { recursive: true });
    }

    let visits = [];
    if (fs.existsSync(VISITS_FILE)) {
      try {
        visits = JSON.parse(fs.readFileSync(VISITS_FILE, "utf8"));
      } catch (e) {
        visits = [];
      }
    }

    visits.push(visit);

    if (visits.length > 10000) {
      visits = visits.slice(-10000);
    }

    fs.writeFileSync(VISITS_FILE, JSON.stringify(visits, null, 2));

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Track error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
