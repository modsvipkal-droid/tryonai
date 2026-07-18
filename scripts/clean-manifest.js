const fs = require("fs");
const path = require("path");

const staticDir = path.join(__dirname, "..", ".next", "static");
const manifestFiles = [];

function findManifests(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findManifests(full);
    } else if (entry.name === "_buildManifest.js") {
      manifestFiles.push(full);
    }
  }
}

findManifests(staticDir);

for (const file of manifestFiles) {
  let content = fs.readFileSync(file, "utf-8");

  // Replace the sortedPages array with a cleaned version
  content = content.replace(
    /"sortedPages":\s*\[([\s\S]*?)\]/,
    (match, arrayContent) => {
      // Parse the array manually
      const raw = arrayContent
        .replace(/\/\/.*$/gm, "")        // strip line comments
        .replace(/,\s*$/, "")            // trailing comma
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);

      const cleaned = raw.filter((p) => {
        if (p === "/_app" || p === "/_error") return true;
        if (p.startsWith("/api/")) return false;
        if (p === "/manageadminbhai") return false;
        return true;
      });

      const formatted = cleaned.map((p) => `    "${p}"`).join(",\n");
      return `"sortedPages": [\n${formatted}\n  ]`;
    }
  );

  fs.writeFileSync(file, content, "utf-8");
  console.log(`Cleaned: ${file}`);
}

console.log(`Done. Cleaned ${manifestFiles.length} manifest file(s).`);