const fs = require("fs");
const path = require("path");
const dir = "D:/Tripzo Holidays/data";
for (const file of ["maps-cid.html", "maps-search.html"]) {
  const p = path.join(dir, file);
  if (!fs.existsSync(p)) { console.log("missing", file); continue; }
  const html = fs.readFileSync(p, "utf8");
  console.log("\n====", file, "len", html.length);
  for (const k of ["Tripzo", "Reviewed", "stars", "starRating", "reviews", "AGO_EXPANDABLE"]) {
    console.log(k, "count", html.split(k).length - 1);
  }
  let i = 0, c = 0;
  while ((i = html.indexOf("Tripzo", i)) !== -1 && c < 5) {
    console.log("Tripzo@", i, JSON.stringify(html.slice(Math.max(0, i - 80), i + 160)));
    i++; c++;
  }
  const needles = ["out of 5", "reviews", "starRating", "\\\\\\\"stars\\\\\\\""];
  for (const needle of needles) {
    let j = html.indexOf(needle);
    if (j >= 0) console.log("ctx", needle, JSON.stringify(html.slice(j, j + 200)));
  }
}
