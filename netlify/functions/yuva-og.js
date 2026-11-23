const {
  fetchProfileMeta,
  defaultMeta,
} = require("./yuva-og-meta");

const SOCIAL_BOT_RE =
  /bot|crawl|slurp|spider|facebookexternalhit|facebot|twitterbot|linkedinbot|whatsapp|telegram|discordbot|skypeuripreview|pinterest|vkshare|embedly|quora link preview|outbrain|google.*preview|bingpreview|yahoo|duckduck|applebot|ia_archiver/i;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const siteBase = (event) => {
  const headers = event.headers || {};
  const host = headers["x-forwarded-host"] || headers.host || "";
  if (host) {
    const proto = headers["x-forwarded-proto"] || "https";
    return `${proto}://${host}`.replace(/\/+$/, "");
  }
  const fromEnv = String(
    process.env.URL || process.env.DEPLOY_PRIME_URL || "https://yuvadarpan.in"
  )
    .trim()
    .replace(/\/+$/, "");
  return fromEnv;
};

const renderPreviewHtml = (meta) => {
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const image = escapeHtml(meta.image);
  const fallbackImage = escapeHtml(meta.fallbackImage || meta.image);
  const url = escapeHtml(meta.url);
  const siteName = escapeHtml(meta.siteName || "Yuvadarpan");
  const width = escapeHtml(meta.imageWidth || 1200);
  const height = escapeHtml(meta.imageHeight || 630);

  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="${siteName}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="${width}" />
  <meta property="og:image:height" content="${height}" />
  <meta property="og:image:alt" content="${title}" />
  <meta property="og:url" content="${url}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta http-equiv="refresh" content="0;url=${url}" />
</head>
<body>
  <main style="font-family:Arial,sans-serif;padding:24px;color:#542b2b;background:#f4f0ea;min-height:100vh">
    <p style="margin:0 0 8px;font-size:14px;letter-spacing:2px">YUVADARPAN</p>
    <h1 style="margin:0 0 12px;font-size:28px">${title}</h1>
    <p style="margin:0 0 16px;color:#666">${description}</p>
    <img src="${image}" alt="${title}" width="600" style="max-width:100%;border-radius:12px" onerror="this.onerror=null;this.src='${fallbackImage}'" />
    <p style="margin-top:16px"><a href="${url}">Open profile</a></p>
  </main>
  <script>window.location.replace(${JSON.stringify(meta.url)});</script>
</body>
</html>`;
};

const injectOgTags = (html, meta) => {
  const tags = `
    <title>${escapeHtml(meta.title)}</title>
    <meta name="description" content="${escapeHtml(meta.description)}" />
    <link rel="canonical" href="${escapeHtml(meta.url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${escapeHtml(meta.siteName || "Yuvadarpan")}" />
    <meta property="og:title" content="${escapeHtml(meta.title)}" />
    <meta property="og:description" content="${escapeHtml(meta.description)}" />
    <meta property="og:image" content="${escapeHtml(meta.image)}" />
    <meta property="og:image:secure_url" content="${escapeHtml(meta.image)}" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="og:image:width" content="${escapeHtml(meta.imageWidth || 1200)}" />
    <meta property="og:image:height" content="${escapeHtml(meta.imageHeight || 630)}" />
    <meta property="og:image:alt" content="${escapeHtml(meta.title)}" />
    <meta property="og:url" content="${escapeHtml(meta.url)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
    <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
    <meta name="twitter:image" content="${escapeHtml(meta.image)}" />
  `;
  let next = String(html || "");
  next = next.replace(/<title>[\s\S]*?<\/title>/i, "");
  next = next.replace(/<meta\s+name=["']description["'][^>]*>/i, "");
  next = next.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, "");
  next = next.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, "");
  if (/<\/head>/i.test(next)) {
    return next.replace(/<\/head>/i, `${tags}</head>`);
  }
  return `<!DOCTYPE html><html><head>${tags}</head><body>${next}</body></html>`;
};

const readSpaHtml = async (site) => {
  const response = await fetch(`${site}/index.html`, {
    headers: { Accept: "text/html" },
  });
  if (!response.ok) {
    throw new Error(`Could not load SPA shell (${response.status})`);
  }
  return response.text();
};

exports.handler = async (event) => {
  const path = event.path || "";
  const match = path.match(/\/yuva\/([^/?#]+)/i);
  const id = decodeURIComponent(
    (match?.[1] || event.queryStringParameters?.id || "").trim()
  );
  const site = siteBase(event);
  const userAgent = event.headers?.["user-agent"] || "";
  const isBot = SOCIAL_BOT_RE.test(userAgent);

  if (!id) {
    return {
      statusCode: 302,
      headers: { Location: "/" },
      body: "",
    };
  }

  try {
    const meta = await fetchProfileMeta(id, site);
    meta.url = `${site}/yuva/${encodeURIComponent(id)}`;
    meta.image = meta.image || defaultMeta(site, id).image;

    // WhatsApp/Facebook/Telegram: return a tiny HTML document with OG tags only.
    // Do not depend on SPA JS — crawlers never execute it.
    if (isBot) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=300",
        },
        body: renderPreviewHtml(meta),
      };
    }

    // Humans: keep the React app, with OG tags already in the HTML head.
    const html = await readSpaHtml(site);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
      },
      body: injectOgTags(html, meta),
    };
  } catch (error) {
    console.error("yuva-og handler failed", error?.message || error);
    const meta = defaultMeta(site, id);
    if (isBot) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "public, max-age=60",
        },
        body: renderPreviewHtml(meta),
      };
    }
    return {
      statusCode: 302,
      headers: { Location: `/index.html` },
      body: "",
    };
  }
};
