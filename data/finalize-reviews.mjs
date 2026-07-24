import { chromium } from "playwright";
import fs from "fs";

const outPath = "D:/Tripzo Holidays/data/google-reviews.json";
const placeUrl =
  "https://www.google.com/maps/place/Tripzo+Holidays/@7.0964889,80.2409971,17z/data=!4m8!3m7!1s0xab2bda6e3fe11401:0x5b32b43257c9be95!8m2!3d7.0964889!4d80.2409971!9m1!1b1!16s%2Fg%2F11yfl1455d?hl=en&entry=ttu";

async function acceptConsent(page) {
  for (const sel of ['button:has-text("Accept all")', 'button:has-text("I agree")', "#L2AGLb"]) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1200 })) {
        await el.click();
        await page.waitForTimeout(1000);
        return true;
      }
    } catch {}
  }
  return false;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await (
    await browser.newContext({
      locale: "en-US",
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      viewport: { width: 1440, height: 1100 },
    })
  ).newPage();

  try {
    await page.goto(placeUrl, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(4000);
    await acceptConsent(page);

    // Ensure Reviews tab
    try {
      await page.getByRole("tab", { name: /Reviews/i }).click({ timeout: 5000 });
      await page.waitForTimeout(2000);
    } catch {}

    // Scroll and expand
    for (let i = 0; i < 15; i++) {
      const panel = page.locator("div.m6QErb.DxyBCb").first();
      if (await panel.count()) {
        try { await panel.evaluate((el) => el.scrollBy(0, 2200)); } catch {}
      }
      await page.mouse.wheel(0, 1600);
      await page.waitForTimeout(400);
    }

    const more = page.locator('button.w8nwRe, button[aria-label*="See more" i], button:has-text("More")');
    const n = Math.min(await more.count(), 40);
    for (let i = 0; i < n; i++) {
      try { await more.nth(i).click({ timeout: 400 }); } catch {}
    }
    await page.waitForTimeout(1000);

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
        let comment =
          card.querySelector(".wiI7pd")?.textContent?.trim() ||
          card.querySelector(".MyEned")?.textContent?.trim() ||
          "";
        // strip trailing "More" / ellipsis artifacts sometimes left
        comment = comment.replace(/\s*More$/i, "").trim();
        const relativeTime = card.querySelector(".rsqaWe")?.textContent?.trim() || undefined;
        if (!name) return;
        if (rating == null && !comment) return;
        const key = name.toLowerCase();
        // prefer entry with comment / rating
        if (seen.has(key)) {
          const existing = results.find((r) => r.name.toLowerCase() === key);
          if (existing && !existing.comment && comment) existing.comment = comment;
          if (existing && existing.rating == null && rating != null) existing.rating = rating;
          if (existing && !existing.relativeTime && relativeTime) existing.relativeTime = relativeTime;
          return;
        }
        seen.add(key);
        const row = { name, rating, comment };
        if (relativeTime) row.relativeTime = relativeTime;
        results.push(row);
      });

      return results.filter((r) => r.rating != null || (r.comment && r.comment.length > 0));
    });

    const title = await page.title();
    const body = await page.locator("body").innerText();
    const reviewCountMatch = body.match(/(\d+)\s+reviews/i);

    if (!reviews.length) {
      const payload = {
        error: "Failed to finalize Tripzo Holidays reviews from DOM.",
        note: `Title: ${title}`,
      };
      fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
      console.log(JSON.stringify(payload, null, 2));
    } else {
      fs.writeFileSync(outPath, JSON.stringify(reviews, null, 2));
      console.log(
        JSON.stringify(
          {
            place: "Tripzo Holidays",
            mapsReviewCountHint: reviewCountMatch?.[1] || null,
            extracted: reviews.length,
            reviews,
          },
          null,
          2
        )
      );
    }
  } catch (err) {
    const payload = { error: String(err?.message || err), note: "finalize scrape failed" };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } finally {
    await browser.close();
  }
}

main();
