const UNFURL_UA =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|SkypeUriPreview|Iframely|embedly|Applebot|WhatsApp/i;
const BROWSER_ENGINE = /AppleWebKit|Chrome|Firefox|Edg\//i;
const HEX_ID_REGEX = /^[a-f0-9]{24}$|^[a-f0-9]{32}$/i;
const ESCAPE_MAP = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"]/g, (ch) => ESCAPE_MAP[ch]);

const textOf = (value, depth = 0) => {
  if (!value || depth > 2) return "";
  if (typeof value === "string") {
    const text = value.trim();
    return HEX_ID_REGEX.test(text) ? "" : text;
  }
  if (typeof value === "number") return String(value);
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      textOf(value.gu, depth + 1) ||
      textOf(value.nameGu, depth + 1) ||
      textOf(value.name, depth + 1) ||
      textOf(value.en, depth + 1) ||
      textOf(value.nameEn, depth + 1) ||
      ""
    );
  }
  return "";
};

const locationOf = (yuva, labels = {}) => {
  const city = textOf(labels?.city) || textOf(yuva?.city);
  const state = textOf(labels?.state) || textOf(yuva?.state);
  return [city, state].filter(Boolean).join(", ");
};

const isPreview = (request, url) => {
  if (url.searchParams.get("preview") === "1") return true;
  const ua = request.headers.get("user-agent") || "";
  if (BROWSER_ENGINE.test(ua) && /WhatsApp/i.test(ua) && !/facebookexternalhit|Facebot|Twitterbot/i.test(ua)) {
    return false;
  }
  if (UNFURL_UA.test(ua)) return true;
  const category = request.headers.get("netlify-agent-category") || "";
  return /page-preview/i.test(category) && !BROWSER_ENGINE.test(ua);
};

let cachedApiBase;
const getApiBase = () => {
  if (cachedApiBase !== undefined) return cachedApiBase;
  try {
    cachedApiBase = String(Netlify.env.get("REACT_APP_BASE_URL") || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/+$/, "");
  } catch {
    cachedApiBase = "";
  }
  return cachedApiBase;
};

const shareHtml = ({ title, description, image, pageUrl }) => {
  const safeTitle = escapeHtml(title);
  const safeDesc = escapeHtml(description);
  const safeUrl = escapeHtml(pageUrl);
  const safeImage = image ? escapeHtml(image) : "";
  const pageTitle = title && title !== "યુવાદર્પણ" ? `${safeTitle} - યુવાદર્પણ` : "યુવાદર્પણ";

  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${pageTitle}</title>
  <meta name="description" content="${safeDesc}" />
  <meta property="og:type" content="profile" />
  <meta property="og:site_name" content="યુવાદર્પણ" />
  <meta property="og:title" content="${safeTitle}" />
  <meta property="og:description" content="${safeDesc}" />
  <meta property="og:url" content="${safeUrl}" />
  ${safeImage ? `<meta property="og:image" content="${safeImage}" />
  <meta property="og:image:alt" content="${safeTitle}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="${safeImage}" />` : '<meta name="twitter:card" content="summary" />'}
  <meta name="twitter:title" content="${safeTitle}" />
  <meta name="twitter:description" content="${safeDesc}" />
</head>
<body>
  ${safeImage ? `<img src="${safeImage}" alt="${safeTitle}" />` : ""}
  <h1>${safeTitle}</h1>
  <p>${safeDesc}</p>
  <a href="${safeUrl}">યુવાદર્પણ</a>
</body>
</html>`;
};

export default async (request, context) => {
  const url = new URL(request.url);
  if (!isPreview(request, url)) return context.next();

  const match = url.pathname.match(/^\/yuva\/([^/]+)\/?$/);
  if (!match) return context.next();

  let id = "";
  try {
    id = decodeURIComponent(match[1]);
  } catch {
    return context.next();
  }
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) return context.next();

  const base = getApiBase();
  if (!/^https?:\/\//i.test(base)) return context.next();

  try {
    const response = await fetch(`${base}/yuvalist/public/${encodeURIComponent(id)}`, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return context.next();

    const yuva = await response.json();
    const labels = yuva?.labels || {};

    const title =
      [
        textOf(yuva?.firstName),
        textOf(yuva?.fatherName),
        textOf(labels.lastName) || textOf(yuva?.lastName),
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() || "યુવાદર્પણ";

    const description = locationOf(yuva, labels) || "યુવાદર્પણ";
    const photo = typeof yuva?.profile === "string" ? yuva.profile : yuva?.profile?.url;
    const image = /^https?:\/\//i.test(photo || "") ? photo : "";

    url.searchParams.delete("preview");
    url.hash = "";

    return new Response(
      shareHtml({
        title,
        description,
        image,
        pageUrl: url.toString(),
      }),
      {
        headers: {
          "content-type": "text/html; charset=utf-8",
          "cache-control": "private, no-store",
          "x-robots-tag": "noindex, nofollow",
        },
      }
    );
  } catch {
    return context.next();
  }
};

export const config = {
  path: "/yuva/*",
  onError: "bypass",
};
