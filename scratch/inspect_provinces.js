const fs = require("fs");
let raw = fs.readFileSync("frontend/public/data/vietnam_34_provinces.geojson", "utf8");
raw = raw.replace(/^\uFEFF/, "");
const data = JSON.parse(raw);
console.log("Total features:", data.features.length);
data.features.forEach((f, i) => {
  console.log(`${i + 1}. [${f.properties.provinceCode}] ${f.properties.name} (${f.properties.type})`);
});
