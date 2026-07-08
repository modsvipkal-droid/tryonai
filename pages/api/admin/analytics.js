import fs from "fs";
import path from "path";

const DB_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DB_DIR, "users.json");
const VISITS_FILE = path.join(DB_DIR, "visits.json");

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      try {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
      } catch (e) {
        users = [];
      }
    }
    const registeredUsersCount = users.length;

    let realVisits = [];
    if (fs.existsSync(VISITS_FILE)) {
      try {
        realVisits = JSON.parse(fs.readFileSync(VISITS_FILE, "utf8"));
      } catch (e) {
        realVisits = [];
      }
    }

    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const totalViews = realVisits.length;
    const totalSessions = realVisits.filter(v => v.isNew).length || Math.min(1, totalViews);
    const uniqueGuestsSet = new Set(
      realVisits.map(v => `${v.device}-${v.browser}-${v.country}-${v.channel}`)
    );
    const uniqueGuests = uniqueGuestsSet.size;
    const totalUsers = registeredUsersCount + uniqueGuests;

    const activeLast30 = now - 30 * 60 * 1000;
    const activeUsers = realVisits.filter(v => v.timestamp > activeLast30).length;
    const todayVisits = realVisits.filter(v => v.timestamp > todayStart.getTime());

    const activeNew = todayVisits.filter(v => v.isNew).length;
    const activeReturning = todayVisits.length - activeNew;

    const activeCounted = new Set(todayVisits.map(v => `${v.device}-${v.browser}`));
    const activeTrafficTimeline = [];
    for (let i = 23; i >= 0; i--) {
      const hrStart = new Date();
      hrStart.setMinutes(0, 0, 0);
      hrStart.setHours(hrStart.getHours() - i);
      const hrEnd = new Date(hrStart.getTime() + 60 * 60 * 1000);
      const count = todayVisits.filter(v => v.timestamp >= hrStart.getTime() && v.timestamp < hrEnd.getTime()).length;
      const label = hrStart.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
      activeTrafficTimeline.push({ time: label, visits: count });
    }

    const devices = {};
    const countries = {};
    const browsers = {};
    const pagesRanking = {};

    for (const v of realVisits) {
      devices[v.device] = (devices[v.device] || 0) + 1;
      countries[v.country] = (countries[v.country] || 0) + 1;
      browsers[v.browser] = (browsers[v.browser] || 0) + 1;
      const p = v.path || "/";
      pagesRanking[p] = (pagesRanking[p] || 0) + 1;
    }

    const deviceList = Object.entries(devices).map(([name, value]) => ({ name, value, percentage: Math.round((value / totalViews) * 100) }));
    const countryList = Object.entries(countries).map(([name, value]) => ({ name, value, percentage: Math.round((value / totalViews) * 100) })).sort((a, b) => b.value - a.value).slice(0, 10);
    const browserList = Object.entries(browsers).map(([name, value]) => ({ name, value, percentage: Math.round((value / totalViews) * 100) }));
    const pageList = Object.entries(pagesRanking).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 10);

    const trafficGraph = [
      { label: "Views", value: totalViews, change: 0 },
      { label: "Visitors", value: totalSessions, change: 0 },
      { label: "Users", value: totalUsers, change: 0 },
    ];

    return res.status(200).json({
      registeredUsersCount,
      totalUsers,
      activeUsers,
      sessionsCount: totalSessions,
      pageViewsCount: totalViews,
      trafficGraph,
      devices: deviceList,
      countries: countryList,
      browsers: browserList,
      pagesRanking: pageList,
      realTimeStats: {
        activeUsers,
        newUsers: activeNew,
        returningUsers: activeReturning,
        chart: activeTrafficTimeline,
      },
      engagement: { avgSessionDuration: "2m 34s", pagesPerSession: "3.2", bounceRate: "42%" },
      social: { visitors: 0, percentage: 0 },
      referral: { visitors: 0, percentage: 0 },
      organic: { visitors: totalViews, percentage: 100 },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Analytics fetch error:", error.message);
    }
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}
