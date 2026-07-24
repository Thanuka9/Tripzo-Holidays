import { chromium } from "playwright";
import fs from "fs";

const outPath = "D:/Tripzo Holidays/data/google-reviews.json";
const urls = [
  "https://www.google.com/maps?cid=6571512934601178773",
  "https://www.google.com/maps/search/?api=1&query=Tripzo%20Holidays%20Sri%20Lanka",
];

async function acceptConsent(page) {
  for (const sel of [
    'button:has-text("Accept all")',
    'button:has-text("I agree")',
    'button:has-text("Accept")',
    "#L2AGLb",
  ]) {
    try {
      const el = page.locator(sel).first();
      if (await el.isVisible({ timeout: 1200 })) {
        await el.click({ timeout: 2000 });
        await page.waitForTimeout(1200);
        return true;
      }
    } catch {}
  }
  return false;
}

async function scrapeOnce(page, url, tag) {
  const notes = [];
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(3500);
  if (await acceptConsent(page)) notes.push("consent");
  if (page.url().includes("consent")) {
    await acceptConsent(page);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(3500);
  }

  // Prefer place result if search page
  const placeLink = page.locator('a[href*="/maps/place/"]').first();
  if (await placeLink.isVisible({ timeout: 4000 }).catch(() => false)) {
    await placeLink.click();
    await page.waitForTimeout(3000);
    notes.push("opened place link");
  }

  // Click rating / reviews count to open reviews
  const openers = [
    page.getByRole("tab", { name: /Reviews/i }),
    page.locator('button[aria-label*="review" i]'),
    page.locator('button:has-text("Reviews")'),
    page.locator('span:has-text("reviews")'),
    page.locator('[aria-label*="stars" i]'),
  ];
  for (const loc of openers) {
    try {
      const el = loc.first();
      if (await el.isVisible({ timeout: 2000 })) {
        await el.click({ timeout: 3000 });
        await page.waitForTimeout(2500);
        notes.push("opened reviews UI");
        break;
      }
    } catch {}
  }

  // Sort / ensure review list panel
  for (let i = 0; i < 10; i++) {
    await page.mouse.wheel(0, 1400);
    await page.waitForTimeout(600);
  }

  // Scroll within possible review list containers
  const scrollSels = [
    'div.m6QErb.DxyBCb.kA9KIf.dS8AEf',
    'div[role="main"]',
    'div.review-dialog-list',
  ];
  for (const sel of scrollSels) {
    const box = page.locator(sel).first();
    if (await box.count()) {
      for (let i = 0; i < 8; i++) {
        try {
          await box.evaluate((el) => el.scrollBy(0, 1800));
        } catch {}
        await page.waitForTimeout(500);
      }
    }
  }

  // Expand truncated reviews
  const moreBtns = page.locator('button[aria-label*="See more" i], button:has-text("More"), button.w8nwRe');
  const mc = Math.min(await moreBtns.count(), 20);
  for (let i = 0; i < mc; i++) {
    try { await moreBtns.nth(i).click({ timeout: 400 }); } catch {}
  }

  await page.screenshot({ path: `D:/Tripzo Holidays/data/maps-scrape-${tag}.png` });

  const dump = {
    title: await page.title(),
    url: page.url(),
    notes,
    body: (await page.locator("body").innerText().catch(() => "")).slice(0, 2500),
  };
  fs.writeFileSync(`D:/Tripzo Holidays/data/maps-dump-${tag}.json`, JSON.stringify(dump, null, 2));

  const reviews = await page.evaluate(() => {
    const results = [];
    const seen = new Set();

    function push(name, rating, comment, relativeTime) {
      name = (name || "").trim();
      comment = (comment || "").trim();
      // skip aggregate-only
      if (!name && !comment) return;
      if (!comment && (rating === 4.8 || rating === null)) return;
      const key = `${name}|${rating}|${comment.slice(0, 60)}`;
      if (seen.has(key)) return;
      seen.add(key);
      const row = { name, rating, comment };
      if (relativeTime) row.relativeTime = relativeTime;
      results.push(row);
    }

    document.querySelectorAll("[data-review-id]").forEach((card) => {
      const nameEl =
        card.querySelector(".d4r55") ||
        card.querySelector(".TSUbDb a") ||
        card.querySelector('button[aria-label]') ||
        card.querySelector('a[href*="/maps/contrib/"]');
      let name = nameEl?.textContent?.trim() || "";
      if (!name && nameEl?.getAttribute) name = nameEl.getAttribute("aria-label") || "";
      const ratingEl =
        card.querySelector('span[role="img"][aria-label*="star" i]') ||
        card.querySelector('[aria-label*="star" i]');
      const aria = ratingEl?.getAttribute("aria-label") || "";
      const rm = aria.match(/([0-9]+(?:\.[0-9]+)?)/);
      const rating = rm ? Number(rm[1]) : null;
      const comment =
        card.querySelector(".wiI7pd")?.textContent?.trim() ||
        card.querySelector(".MyEned")?.textContent?.trim() ||
        "";
      const relativeTime =
        card.querySelector(".rsqaWe")?.textContent?.trim() ||
        card.querySelector(".dehysf")?.textContent?.trim() ||
        "";
      push(name, rating, comment, relativeTime);
    });

    // Fallback: parse visible text blocks that look like reviews
    if (results.length === 0) {
      const stars = [...document.querySelectorAll('span[role="img"][aria-label*="star" i]')];
      for (const star of stars) {
        const aria = star.getAttribute("aria-label") || "";
        const rm = aria.match(/([0-9]+(?:\.[0-9]+)?)\s*star/i);
        if (!rm) continue;
        const rating = Number(rm[1]);
        if (rating > 5) continue;
        let root = star.parentElement;
        for (let i = 0; i < 8 && root; i++) {
          const text = root.innerText || "";
          if (text.length > 40 && text.length < 2000) {
            const lines = text.split(/\n+/).map((s) => s.trim()).filter(Boolean);
            // typical: name, rating line, time, comment...
            const name = lines[0] && lines[0].length < 60 ? lines[0] : "";
            const timeLine = lines.find((l) => /ago|yesterday|week|month|year|hour|day/i.test(l));
            let comment = "";
            const idx = lines.findIndex((l) => l === timeLine);
            if (idx >= 0 && lines[idx + 1]) comment = lines.slice(idx + 1).join(" ").slice(0, 1000);
            else if (lines.length > 2) comment = lines.slice(2).join(" ").slice(0, 1000);
            if (name && (comment || rating <= 5)) {
              push(name, rating, comment, timeLine || "");
              break;
            }
          }
          root = root.parentElement;
        }
      }
    }

    return results;
  });

  return { reviews, notes, title: dump.title, url: dump.url, body: dump.body };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    locale: "en-US",
    geolocation: { latitude: 7.8731, longitude: 80.7718 },
    permissions: ["geolocation"],
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  let all = [];
  let lastMeta = null;
  try {
    for (let i = 0; i < urls.length; i++) {
      const res = await scrapeOnce(page, urls[i], String(i));
      lastMeta = res;
      console.log("pass", i, "count", res.reviews.length, "title", res.title);
      all = all.concat(res.reviews);
      if (res.reviews.length >= 3) break;
    }
    // dedupe
    const seen = new Set();
    all = all.filter((r) => {
      const k = `${r.name}|${r.comment?.slice(0, 50)}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

    if (!all.length) {
      const payload = {
        error: "Could not extract individual Google reviews (Playwright loaded Maps but found no review cards).",
        note: `Last title: ${lastMeta?.title}. URL: ${lastMeta?.url}. Notes: ${(lastMeta?.notes || []).join("; ")}. Body starts: ${(lastMeta?.body || "").replace(/\s+/g, " ").slice(0, 400)}. Curl HTML had no review snippets; Maps listugcposts RPC returned HTTP 403.`,
      };
      fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
      console.log(JSON.stringify(payload, null, 2));
    } else {
      fs.writeFileSync(outPath, JSON.stringify(all, null, 2));
      console.log("extracted", all.length);
      console.log(JSON.stringify(all, null, 2));
    }
  } catch (err) {
    const payload = {
      error: String(err?.message || err),
      note: "Playwright scrape failed after curl shells lacked review text.",
    };
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(payload, null, 2));
  } finally {
    await browser.close();
  }
}

main();
