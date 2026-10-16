#!/usr/bin/env node
// SEO/GEO health check for chinesetutoryang.com — no dependencies.
//   node .claude/skills/seo-geo-audit/audit.mjs                 # the live site
//   node .claude/skills/seo-geo-audit/audit.mjs http://localhost:3000   # a local dev server
// Exit code 1 if any FAIL. WARN items are judgement calls worth a look.

const base = (process.argv[2] ?? "https://www.chinesetutoryang.com").replace(/\/$/, "");
const fails = [];
const warns = [];
const fail = (where, msg) => fails.push(`${where}: ${msg}`);
const warn = (where, msg) => warns.push(`${where}: ${msg}`);

const decode = (s) =>
  s.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

async function get(path) {
  const res = await fetch(base + path, { redirect: "follow" });
  return { status: res.status, type: res.headers.get("content-type") ?? "", text: await res.text() };
}

function metaTags(html) {
  return [...html.matchAll(/<meta\s+([^>]*?)\/?>/gi)].map((m) => {
    const attrs = {};
    for (const a of m[1].matchAll(/([\w:-]+)="([^"]*)"/g)) attrs[a[1].toLowerCase()] = decode(a[2]);
    return attrs;
  });
}

function inspectPage(path, html) {
  const where = path;
  const metas = metaTags(html);
  const meta = (key, val) => metas.find((m) => m[key] === val)?.content;

  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
  const desc = meta("name", "description");
  const canonical = html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/i)?.[1];
  const robotsMeta = meta("name", "robots") ?? "";

  if (!title) fail(where, "missing <title>");
  else {
    const t = decode(title);
    if (t.length < 25 || t.length > 65) warn(where, `title is ${t.length} chars (aim for ~30–60): "${t}"`);
  }
  if (!desc) fail(where, "missing meta description");
  else if (desc.length < 100 || desc.length > 165) warn(where, `description is ${desc.length} chars (aim for ~110–160)`);

  if (!canonical) fail(where, "missing canonical link");
  else {
    const canonPath = new URL(canonical).pathname.replace(/\/$/, "") || "/";
    const thisPath = path.replace(/\/$/, "") || "/";
    if (canonPath !== thisPath) fail(where, `canonical points to ${canonical}, not this page`);
  }

  if (!meta("property", "og:title")) fail(where, "missing og:title");
  if (!meta("property", "og:description")) fail(where, "missing og:description");
  if (!meta("property", "og:image")) fail(where, "missing og:image");
  if (/noindex/i.test(robotsMeta)) fail(where, "page is marked noindex but is in the sitemap");

  const h1s = (html.match(/<h1[\s>]/gi) ?? []).length;
  if (h1s !== 1) fail(where, `has ${h1s} <h1> tags (want exactly 1)`);

  const noAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter((m) => !/\salt="/i.test(m[0])).length;
  if (noAlt) warn(where, `${noAlt} <img> without alt text`);

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)];
  if (blocks.length === 0) fail(where, "no JSON-LD structured data");
  const nodes = [];
  for (const b of blocks) {
    try {
      const d = JSON.parse(decode(b[1]));
      nodes.push(...(d["@graph"] ?? [d]));
    } catch (e) {
      fail(where, `invalid JSON-LD: ${e.message}`);
    }
  }
  return { title: title && decode(title), desc, nodes };
}

const money = (n) => `£${Number(n).toFixed(2)}`;

// ---- robots / sitemap / llms.txt ----
const robots = await get("/robots.txt");
if (robots.status !== 200) fail("/robots.txt", `HTTP ${robots.status}`);
else {
  if (!/^Sitemap:\s*\S+/im.test(robots.text)) fail("/robots.txt", "no Sitemap: line");
  if (/^Disallow:\s*\/\s*$/im.test(robots.text)) fail("/robots.txt", "blocks the whole site");
  for (const p of ["/admin", "/api/", "/manage/"])
    if (!robots.text.includes(`Disallow: ${p}`)) warn("/robots.txt", `${p} is not disallowed`);
}

const sitemap = await get("/sitemap.xml");
let paths = [];
if (sitemap.status !== 200) fail("/sitemap.xml", `HTTP ${sitemap.status}`);
else {
  paths = [...sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname || "/");
  if (paths.length === 0) fail("/sitemap.xml", "lists no URLs");
}

const llms = await get("/llms.txt");
if (llms.status !== 200 || llms.text.trim().length < 200) fail("/llms.txt", `HTTP ${llms.status} or too short`);

// ---- every page in the sitemap ----
const seenTitles = new Map();
const seenDescs = new Map();
const pageData = {};
for (const path of paths) {
  const page = await get(path);
  if (page.status !== 200) {
    fail(path, `HTTP ${page.status}`);
    continue;
  }
  const info = inspectPage(path, page.text);
  pageData[path] = { ...info, html: page.text };
  if (info.title) {
    if (seenTitles.has(info.title)) fail(path, `same title as ${seenTitles.get(info.title)}`);
    seenTitles.set(info.title, path);
  }
  if (info.desc) {
    if (seenDescs.has(info.desc)) fail(path, `same description as ${seenDescs.get(info.desc)}`);
    seenDescs.set(info.desc, path);
  }
}

// ---- cross-checks: the same facts must agree everywhere ----
const offers = (pageData["/pricing"]?.nodes ?? [])
  .filter((n) => n["@type"] === "ItemList")
  .flatMap((n) => n.itemListElement.map((e) => ({ name: e.item.name, price: e.item.offers.price })));
if (paths.includes("/pricing") && offers.length === 0) fail("/pricing", "no Offer data in structured data");
for (const o of offers) {
  if (!llms.text.includes(money(o.price))) fail("/llms.txt", `missing price ${money(o.price)} for "${o.name}"`);
  if (!pageData["/pricing"].html.includes(money(o.price).replace("£", "£")))
    warn("/pricing", `visible page text doesn't show ${money(o.price)} for "${o.name}"`);
}

const rating = (pageData["/testimonials"]?.nodes ?? []).find((n) => n.aggregateRating)?.aggregateRating;
if (rating) {
  const visible = pageData["/testimonials"].html.replace(/<!--.*?-->/g, "");
  if (!visible.includes(`${rating.reviewCount} Reviews`))
    warn("/testimonials", `structured data says ${rating.reviewCount} reviews but the page text doesn't show "${rating.reviewCount} Reviews"`);
}

// Private pages should stay out of search results.
const manage = await get("/manage/seo-audit-probe");
if (!/noindex/i.test(metaTags(manage.text).find((m) => m.name === "robots")?.content ?? ""))
  warn("/manage/[token]", "not marked noindex");

// ---- report ----
console.log(`SEO/GEO audit of ${base}  (${paths.length} pages from sitemap)\n`);
for (const p of paths) {
  const d = pageData[p];
  console.log(`  ${p.padEnd(24)} ${d ? `${d.nodes.map((n) => n["@type"]).flat().join(", ")}` : "— not checked"}`);
}
console.log(`\n${fails.length} FAIL, ${warns.length} WARN`);
for (const f of fails) console.log(`  FAIL  ${f}`);
for (const w of warns) console.log(`  WARN  ${w}`);
process.exit(fails.length ? 1 : 0);
