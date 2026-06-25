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
    // 1. Get real registered users
    let users = [];
    if (fs.existsSync(USERS_FILE)) {
      try {
        users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
      } catch (e) {
        users = [];
      }
    }
    const registeredUsersCount = users.length;

    // 2. Get real visits
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
    
    // Count real sessions (unique visitor per 30 minutes, or visits marked isNew)
    const totalSessions = realVisits.filter(v => v.isNew).length || Math.min(1, totalViews);

    // Unique guests (determined by unique combinations of device, browser, country, channel)
    const uniqueGuestsSet = new Set(
      realVisits.map(v => `${v.device}-${v.browser}-${v.country}-${v.channel}`)
    );
    const uniqueGuests = uniqueGuestsSet.size;
    const totalUsers = registeredUsersCount + uniqueGuests;

    // 3. Active Users in last 5 minutes (always at least 1 representing the admin viewing page)
    const fiveMinsAgo = now - 5 * 60 * 1000;
    const activeVisits = realVisits.filter(v => v.timestamp >= fiveMinsAgo);
    
    const activeUsersSet = new Set(
      activeVisits.map(v => `${v.device}-${v.browser}-${v.country}`)
    );
    const activeUsers = Math.max(1, activeUsersSet.size);

    const activeNew = activeVisits.filter(v => v.isNew).length;
    const activeReturning = Math.max(0, activeUsers - activeNew);

    // 4. Site Traffic Graph (Past 7 Days - 100% Real data)
    const trafficGraph = [];
    for (let i = 6; i >= 0; i--) {
      const dStart = new Date();
      dStart.setDate(dStart.getDate() - i);
      dStart.setHours(0, 0, 0, 0);

      const dEnd = new Date(dStart);
      dEnd.setDate(dStart.getDate() + 1);

      const dayVisits = realVisits.filter(
        v => v.timestamp >= dStart.getTime() && v.timestamp < dEnd.getTime()
      );

      const newVisitors = dayVisits.filter(v => v.isNew).length;
      const returningVisitors = dayVisits.length - newVisitors;

      trafficGraph.push({
        date: dStart.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        newVisitors,
        returningVisitors,
        total: dayVisits.length
      });
    }

    // 5. Devices Breakdown (100% Real)
    let totalMobile = 0;
    let totalDesktop = 0;
    let totalTablet = 0;

    realVisits.forEach(v => {
      if (v.device === "Mobile") totalMobile++;
      else if (v.device === "Tablet") totalTablet++;
      else totalDesktop++;
    });

    const totalDevices = totalViews || 1;
    const devices = {
      mobile: { count: totalMobile, percentage: Math.round((totalMobile / totalDevices) * 100) },
      desktop: { count: totalDesktop, percentage: Math.round((totalDesktop / totalDevices) * 100) },
      tablet: { count: totalTablet, percentage: Math.round((totalTablet / totalDevices) * 100) },
    };

    // 6. Countries Breakdown (100% Real)
    const countriesMap = {};
    realVisits.forEach(v => {
      const c = v.country || "India";
      countriesMap[c] = (countriesMap[c] || 0) + 1;
    });

    // Flags mapping helper
    const flagMap = {
      "India": "🇮🇳", "IN": "🇮🇳",
      "United States": "🇺🇸", "US": "🇺🇸",
      "United Kingdom": "🇬🇧", "GB": "🇬🇧",
      "Canada": "🇨🇦", "CA": "🇨🇦",
      "Germany": "🇩🇪", "DE": "🇩🇪",
      "Australia": "🇦🇺", "AU": "🇦🇺",
      "France": "🇫🇷", "FR": "🇫🇷",
      "Direct": "🌐"
    };

    const countries = Object.entries(countriesMap).map(([name, count]) => ({
      name,
      flag: flagMap[name] || "🌐",
      count
    })).sort((a, b) => b.count - a.count);

    // 7. Browsers Breakdown (100% Real)
    const browsersMap = {};
    realVisits.forEach(v => {
      const b = v.browser || "Chrome";
      browsersMap[b] = (browsersMap[b] || 0) + 1;
    });

    const browsers = Object.entries(browsersMap).map(([name, count]) => ({
      name,
      count
    })).sort((a, b) => b.count - a.count);

    // 8. Pages Ranking (100% Real)
    const pagesMap = {};
    realVisits.forEach(v => {
      const p = v.path || "/";
      pagesMap[p] = (pagesMap[p] || 0) + 1;
    });

    const pagesRanking = Object.entries(pagesMap).map(([path, count]) => ({
      path,
      count
    })).sort((a, b) => b.count - a.count);

    // 9. Real-time Bar Chart (Active users in last 10 minutes - 100% Real)
    const realTimeChart = [];
    for (let i = 9; i >= 0; i--) {
      const tStart = now - (i + 1) * 60 * 1000;
      const tEnd = now - i * 60 * 1000;

      const minVisits = realVisits.filter(v => v.timestamp >= tStart && v.timestamp < tEnd);
      const minUsers = new Set(minVisits.map(v => `${v.device}-${v.browser}`)).size;

      const timeLabel = new Date(tEnd).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: false
      });

      realTimeChart.push({
        time: timeLabel,
        activeUsers: i === 0 ? activeUsers : Math.max(0, minUsers)
      });
    }

    // 10. Engagement Metrics (100% Real)
    const pagesPerSession = totalSessions === 0 ? "0.00" : (totalViews / totalSessions).toFixed(2);
    const sessionsPerUser = totalUsers === 0 ? "0.00" : (totalSessions / totalUsers).toFixed(2);
    const viewsPerUser = totalUsers === 0 ? "0.00" : (totalViews / totalUsers).toFixed(2);

    const engagement = {
      pagesPerSession,
      sessionsPerUser,
      viewsPerUser
    };

    // 11. Social, Referral, and Organic Traffic (100% Real)
    let instagram = 0;
    let facebook = 0;
    let googleAccounts = 0;
    let otherApps = 0;
    let googleSearch = 0;
    let duckDuckGo = 0;

    realVisits.forEach(v => {
      if (v.channel === "Social Media") {
        if (v.source === "Instagram") instagram++;
        else if (v.source === "Facebook") facebook++;
      } else if (v.channel === "Referral") {
        if (v.source === "Google accounts") googleAccounts++;
        else otherApps++;
      } else if (v.channel === "Organic Search") {
        if (v.source === "Google") googleSearch++;
        else if (v.source === "DuckDuckGo") duckDuckGo++;
      }
    });

    const social = { instagram, facebook };
    const referral = { googleAccounts, otherApps };
    const organic = { googleSearch, duckDuckGo };

    return res.status(200).json({
      registeredUsersCount,
      totalUsers,
      activeUsers,
      sessionsCount: totalSessions,
      pageViewsCount: totalViews,
      trafficGraph,
      devices,
      countries,
      browsers,
      pagesRanking,
      realTimeStats: {
        activeUsers,
        newUsers: activeNew,
        returningUsers: activeReturning,
        chart: realTimeChart
      },
      engagement,
      social,
      referral,
      organic
    });

  } catch (error) {
    console.error("Analytics fetch error:", error);
    return res.status(500).json({ error: error.message });
  }
}
