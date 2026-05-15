/**
 * Site → JSON export: discover URLs from sitemap(s), fetch each page, strip
 * header/footer (and common chrome), extract text, headings, links, images, meta.
 *
 * Usage:
 *   node scripts/crawl-sitemap-to-json.mjs https://example.com
 *   node scripts/crawl-sitemap-to-json.mjs https://example.com --out ./site-json
 *   node scripts/crawl-sitemap-to-json.mjs https://example.com --sitemap https://example.com/custom.xml
 *   node scripts/crawl-sitemap-to-json.mjs https://example.com --delay 400 --concurrency 3 --max 50
 */
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as cheerio from "cheerio";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const UA =
  "Mozilla/5.0 (compatible; SitemapJsonCrawler/1.0; +https://github.com/) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

function parseArgs(argv) {
  const positional = [];
  const flags = new Map();
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const [k, v] = a.includes("=") ? a.slice(2).split("=", 2) : [a.slice(2), argv[i + 1]];
      if (!a.includes("=") && argv[i + 1] && !argv[i + 1].startsWith("--")) {
        flags.set(k, v);
        i++;
      } else {
        flags.set(k, v ?? "true");
      }
    } else positional.push(a);
  }
  return { positional, flags };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function shortHash(s) {
  return crypto.createHash("sha256").update(s).digest("hex").slice(0, 12);
}

function sanitizeSegment(seg) {
  return (
    String(seg)
      .replace(/[<>:"|?*\\]/g, "_")
      .replace(/\s+/g, "_")
      .slice(0, 120) || "_"
  );
}

/** Write JSON under outRoot mirroring host + path; safe on Windows. */
function urlToOutputPath(outRoot, pageUrl) {
  const u = new URL(pageUrl);
  const host = u.hostname.replace(/^www\./i, "");
  const rawParts = u.pathname.split("/").filter(Boolean).map(sanitizeSegment);
  const parts = rawParts.length ? rawParts : ["index"];
  const fileBase = parts.pop();
  const name = u.search ? `${fileBase}_${shortHash(u.search)}` : fileBase;
  const relDir = path.join(host, ...parts);
  const fullDir = path.join(outRoot, relDir);
  const maxLen = 240;
  let file = `${name}.json`;
  let fullPath = path.join(fullDir, file);
  if (fullPath.length > maxLen) {
    const h = shortHash(pageUrl);
    fullPath = path.join(outRoot, host, `_long_${h}.json`);
  }
  return fullPath;
}

async function fetchText(url, { accept = "*/*" } = {}) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: accept, "Accept-Language": "en-US,en;q=0.9" },
    redirect: "follow",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

function extractLocs(xml) {
  const out = [];
  const re = /<loc>\s*([^<]+?)\s*<\/loc>/gi;
  let m;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}

function isSitemapIndex(xml) {
  return /<sitemapindex[\s>]/i.test(xml);
}

function parseRobotsSitemaps(robotsText) {
  const urls = [];
  for (const line of robotsText.split(/\r?\n/)) {
    const match = /^\s*Sitemap:\s*(.+)\s*$/i.exec(line);
    if (match) urls.push(match[1].trim());
  }
  return urls;
}

async function collectPageUrlsFromSitemap(sitemapUrl, seenSitemaps = new Set()) {
  if (seenSitemaps.has(sitemapUrl)) return [];
  seenSitemaps.add(sitemapUrl);
  const xml = await fetchText(sitemapUrl, { accept: "application/xml,text/xml,*/*" });
  const locs = extractLocs(xml);
  if (isSitemapIndex(xml)) {
    const nested = await Promise.all(
      locs.map((loc) => collectPageUrlsFromSitemap(loc, seenSitemaps)),
    );
    return nested.flat();
  }
  return locs;
}

async function discoverSitemapEntryUrls(siteInput, explicitSitemap) {
  const origin = new URL(siteInput).origin;

  if (explicitSitemap) {
    return collectPageUrlsFromSitemap(new URL(explicitSitemap, origin).href);
  }

  const candidates = [];

  try {
    const robots = await fetchText(`${origin}/robots.txt`, { accept: "text/plain,*/*" });
    candidates.push(...parseRobotsSitemaps(robots));
  } catch {
    /* ignore */
  }

  for (const p of ["/sitemap.xml", "/sitemap_index.xml", "/wp-sitemap.xml"]) {
    candidates.push(new URL(p, origin).href);
  }

  const seen = new Set();
  const pageUrls = [];
  for (const sm of candidates) {
    if (seen.has(sm)) continue;
    seen.add(sm);
    try {
      const urls = await collectPageUrlsFromSitemap(sm);
      for (const u of urls) pageUrls.push(u);
    } catch {
      /* try next */
    }
  }

  return [...new Set(pageUrls)];
}

function normalizeWhitespace(t) {
  return t.replace(/\s+/g, " ").trim();
}

function absolutizeUrl(base, href) {
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}

function stripChrome($) {
  const removeSel = [
    "header",
    "footer",
    '[role="banner"]',
    '[role="contentinfo"]',
    "script",
    "style",
    "noscript",
    "template",
  ].join(", ");
  $(removeSel).remove();
}

function extractPageJson(pageUrl, html) {
  const $ = cheerio.load(html, { decodeEntities: true });
  stripChrome($);

  let $root = $("main");
  if (!$root.length) $root = $("article").first();
  if (!$root.length) $root = $("body");

  const title = normalizeWhitespace($("title").first().text() || "");
  const metaDescription =
    $('meta[name="description"]').attr("content") ||
    $('meta[property="og:description"]').attr("content") ||
    "";

  const headings = [];
  $root.find("h1,h2,h3,h4,h5,h6").each((_, el) => {
    const tag = el.tagName?.toLowerCase() || "h";
    const text = normalizeWhitespace($(el).text());
    if (text) headings.push({ tag, text });
  });

  const images = [];
  $root.find("img").each((_, el) => {
    const src = $(el).attr("src") || $(el).attr("data-src") || "";
    if (!src) return;
    const alt = $(el).attr("alt") || "";
    images.push({
      src: absolutizeUrl(pageUrl, src),
      alt: String(alt).trim(),
    });
  });

  const links = [];
  $root.find("a[href]").each((_, el) => {
    const href = $(el).attr("href") || "";
    if (!href || href.startsWith("#") || href.toLowerCase().startsWith("javascript:")) return;
    const text = normalizeWhitespace($(el).text());
    links.push({
      href: absolutizeUrl(pageUrl, href),
      text,
    });
  });

  const text = normalizeWhitespace($root.text());
  const htmlSnippet = $root.html() ?? "";

  return {
    url: pageUrl,
    fetchedAt: new Date().toISOString(),
    title,
    meta: { description: metaDescription.trim() },
    headings,
    images,
    links,
    text,
    htmlMain: htmlSnippet,
  };
}

async function runPool(items, concurrency, worker) {
  const queue = [...items];
  const workers = Array.from(
    { length: Math.min(concurrency, Math.max(1, queue.length)) },
    async () => {
      while (queue.length) {
        const item = queue.shift();
        if (!item) break;
        await worker(item);
      }
    },
  );
  await Promise.all(workers);
}

async function main() {
  const { positional, flags } = parseArgs(process.argv);
  const site = positional[0];
  if (!site) {
    console.error(
      "Usage: node scripts/crawl-sitemap-to-json.mjs <site-url> [--out dir] [--sitemap url] [--delay ms] [--concurrency n] [--max n]",
    );
    process.exit(0);
  }

  const outRoot = path.resolve(flags.get("out") || path.join(__dirname, "..", "site-json-export"));
  const explicitSitemap = flags.get("sitemap");
  const delayMs = Math.max(0, Number(flags.get("delay") || 250));
  const concurrency = Math.max(1, Math.min(20, Number(flags.get("concurrency") || 2)));
  const maxPages = flags.get("max") ? Number(flags.get("max")) : Infinity;

  console.log("Output:", outRoot);
  console.log("Discovering URLs from sitemap(s)…");

  let urls = await discoverSitemapEntryUrls(site, explicitSitemap);
  if (!urls.length) {
    console.error(
      "No URLs found. Try: --sitemap https://yoursite.com/sitemap.xml\n" +
        "Some hosts block bots; check robots.txt and sitemap location.",
    );
    process.exit(2);
  }

  urls = [...new Set(urls)].slice(0, Number.isFinite(maxPages) ? maxPages : undefined);
  console.log(
    `Found ${urls.length} URL(s). Crawling with concurrency=${concurrency}, delay=${delayMs}ms…`,
  );

  fs.mkdirSync(outRoot, { recursive: true });
  const manifest = {
    site,
    generatedAt: new Date().toISOString(),
    count: urls.length,
    urls,
    errors: [],
  };

  await runPool(urls, concurrency, async (pageUrl) => {
    const outPath = urlToOutputPath(outRoot, pageUrl);
    try {
      const html = await fetchText(pageUrl, {
        accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      });
      const data = extractPageJson(pageUrl, html);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, JSON.stringify(data, null, 2), "utf8");
      console.log("OK", pageUrl, "→", path.relative(outRoot, outPath));
    } catch (e) {
      const err = { url: pageUrl, message: String(e?.message || e) };
      manifest.errors.push(err);
      console.error("FAIL", pageUrl, err.message);
      const failPath = outPath.replace(/\.json$/i, ".error.json");
      fs.mkdirSync(path.dirname(failPath), { recursive: true });
      fs.writeFileSync(
        failPath,
        JSON.stringify({ ...err, at: new Date().toISOString() }, null, 2),
        "utf8",
      );
    }
    if (delayMs) await sleep(delayMs);
  });

  fs.writeFileSync(path.join(outRoot, "_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log("Done. Manifest:", path.join(outRoot, "_manifest.json"));
  if (manifest.errors.length) console.warn("Errors:", manifest.errors.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
