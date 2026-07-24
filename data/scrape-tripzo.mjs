import { chromium } from "playwright";
import fs from "fs";

const outPath = "D:/Tripzo Holidays/data/google-reviews.json";
const placeUrl =
  "https://www.google.com/maps/place/Tripzo+Holidays/@7.0964889,80.2409971,17z/data=!4m8!3m7!1s0xab2bda6e3fe11401:0x5b32b43257c9be95!8m2!3d7.0964889!4d80.2409971!9m1!1b1!16s%2Fg%2F11yfl1455d?entry=ttu&hl=en";

async function acceptConsent(page) {
  for (const sel of ['button:has-text("Accept all")', 'button:has-text("I agree")', "#L2AGLb"]) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1500 })) {
        await el.click();
        await page.waitForTimeout(1500);
        return true;
      }
    } catch {}
  }
  return false;
}

function extractReviewsFromText(text) {
  // Heuristic parse of listugcposts-like protobuf text
  const reviews = [];
  // Look for patterns: name near star ratings and long quoted strings
  const starRe = /\\?"stars\\?":\s*(\d)|\[(\d)],null,null,null,null,null,null,\[\[\\?"([^"\\]{2,80})\\?"/g;
  return reviews;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "en-US",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();

  const networkHits = [];
  page.on("response", async (res) => {
    try {
      const u = res.url();
      if (
        /listugcposts|review|batchexecute|preview\/review|local/i.test(u) &&
        res.status() < 500
      ) {
        const ct = res.headers()["content-type"] || "";
        let body = "";
        try {
          body = await res.text();
        } catch {
          return;
        }
        if (body.length > 50) {
          networkHits.push({ url: u.slice(0, 200), status: res.status(), len: body.length, sample: body.slice(0, 300) });
          // Save large bodies
          if (/listugcposts|review/i.test(u) && body.length > 500) {
            const fname = `D:/Tripzo Holidays/data/net-${networkHits.length}.txt`;
            fs.writeFileSync(fname, body);
          }
        }
      }
    } catch {}
  });

  try {
    await page.goto(placeUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(4000);
    await acceptConsent(page);
    if (page.url().includes("consent")) {
      await acceptConsent(page);
      await page.goto(placeUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
      await page.waitForTimeout(4000);
    }

    // Dismiss limited-view banners / get app
    for (const t of ["Not now", "No thanks", "Stay on web", "Continue"]) {
      try {
        const b = page.getByRole("button", { name: new RegExp(t, "i") }).first();
        if (await b.isVisible({ timeout: 800 })) await b.click();
      } catch {}
    }

    // Click reviews / stars
    for (const loc of [
      page.getByRole("tab", { name: /Reviews/i }),
      page.locator('button[jsaction*="review"]'),
      page.locator('button:has-text("reviews")'),
      page.locator('span:text-matches("\\\\d+ reviews", "i")'),
      page.locator('text=/4\\.8/'),
    ]) {
      try {
        const el = loc.first();
        if (await el.isVisible({ timeout: 1500 })) {
          await el.click();
          await page.waitForTimeout(2000);
        }
      } catch {}
    }

    // Scroll main panel
    for (let i = 0; i < 12; i++) {
      await page.mouse.wheel(0, 1500);
      await page.waitForTimeout(500);
      const panel = page.locator("div.m6QErb.DxyBCb").first();
      if (await panel.count()) {
        try { await panel.evaluate((el) => el.scrollBy(0, 2000)); } catch {}
      }
    }

    await page.waitForTimeout(3000);
    await page.screenshot({ path: "D:/Tripzo Holidays/data/maps-scrape-tripzo.png" });

    const bodyText = await page.locator("body").innerText();
    fs.writeFileSync(
      "D:/Tripzo Holidays/data/maps-dump-tripzo.json",
      JSON.stringify({ title: await page.title(), url: page.url(), body: bodyText.slice(0, 4000), networkHits }, null, 2)
    );

    const reviews = await page.evaluate(() => {
      const results = [];
      const seen = new Set();
      document.querySelectorAll("[data-review-id]").forEach((card) => {
        const name =
          card.querySelector(".d4r55")?.textContent?.trim() ||
          card.querySelector('a[href*="/maps/contrib/"]')?.textContent?.trim() ||
          "";
        const ratingEl = card.querySelector('span[role="img"][aria-label*="star" i]');
        const aria = ratingEl?.getAttribute("aria-label") || "";
        const rm = aria.match(/([0-9]+(?:\.[0-9]+)?)/);
        const rating = rm ? Number(rm[1]) : null;
        const comment = card.querySelector(".wiI7pd")?.textContent?.trim() || "";
        const relativeTime = card.querySelector(".rsqaWe")?.textContent?.trim() || "";
        const key = name + comment.slice(0, 40);
        if ((name || comment) && !seen.has(key)) {
          seen.add(key);
          const row = { name, rating, comment };
          if (relativeTime) row.relativeTime = relativeTime;
          results.push(row);
        }
      });
      return results;
    });

    // Parse network dumps for review-like strings if DOM empty
    let fromNet = [];
    if (!reviews.length) {
      const files = fs.readdirSync("D:/Tripzo Holidays/data").filter((f) => f.startsWith("net-") && f.endsWith(".txt"));
      for (const f of files) {
        const t = fs.readFileSync(`D:/Tripzo Holidays/data/${f}`, "utf8");
        // Common Maps format: ["Author Name", ... , n stars ..., "review text", ... "X months ago"
        const re =
          /\[\s*"([^"]{2,80})"\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*null\s*,\s*\[null\s*,\s*null\s*,\s*"https:\/\/lh3\.googleusercontent\.com[^"]*"[\s\S]{0,400}?\[(\d)][\s\S]{0,200}?"([^"]{15,800})"[\s\S]{0,300}?"(\d+\s+(?:day|days|week|weeks|month|months|year|years)\s+ago|a\s+(?:day|week|month|year)\s+ago)"/g;
        let m;
        while ((m = re.exec(t))) {
          fromNet.push({
            name: m[1],
            rating: Number(m[2]),
            comment: m[3],
            relativeTime: m[4],
          });
        }
        // Simpler: quoted long strings near "stars"
        if (!fromNet.length && /stars|REVIEW/i.test(t)) {
          fs.writeFileSync(`D:/Tripzo Holidays/data/${f}.meta.json`, JSON.stringify({ hasStars: /stars/i.test(t), len: t.length }));
        }
      }
    }

    const final = reviews.length ? reviews : fromNet;
    if (!final.length) {
      const limited = /limited view/i.test(bodyText);
      const payload = {
        error: "Could not extract Tripzo Holidays Google reviews.",
        note: limited
          ? "Google Maps returned a limited view for Tripzo Holidays (4.8 rating visible, no individual review cards). Search URL incorrectly opened Classic Lanka Travels. Curl HTML shells had no review snippets; listugcposts returned 403. Network capture hits: " +
            networkHits.length
          : `DOM reviews empty. Title: ${await page.title()}. Network hits: ${networkHits.length}. Body: ${bodyText.replace(/\s+/g, " ").slice(0, 350)}`,
      };
      fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
      console.log(JSON.stringify(payload, null, 2));
      console.log("networkHits", JSON.stringify(networkHits, null, 2));
    } else {
      fs.writeFileSync(outPath, JSON.stringify(final, null, 2));
      console.log("extracted", final.length);
      console.log(JSON.stringify(final, null, 2));
    }
  } catch (err) {
    const payload = {
      error: String(err?.message || err),
      note: "Playwright Tripzo-specific scrape failed.",
    };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } finally {
    await browser.close();
  }
}

main();
