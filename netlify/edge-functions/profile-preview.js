const UNFURL_UA =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|SkypeUriPreview|Iframely|embedly|Applebot|WhatsApp/i;
const BROWSER_ENGINE = /AppleWebKit|Chrome|Firefox|Edg\//i;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const textOf = (value, depth = 0) => {
  if (value == null || depth > 3) return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const text = value.trim();
    if (/^[a-f0-9]{24}$/i.test(text) || /^[a-f0-9]{32}$/i.test(text)) return "";
    return text;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return textOf(value.en, depth + 1) || textOf(value.gu, depth + 1) || textOf(value.name, depth + 1) || "";
  }
  return "";
};

const isPreview = (request) => {
  const url = new URL(request.url);
  if (url.searchParams.get("preview") === "1") return true;
  const ua = request.headers.get("user-agent") || "";
  if (BROWSER_ENGINE.test(ua) && /WhatsApp/i.test(ua) && !/facebookexternalhit|Facebot|Twitterbot/i.test(ua)) {
    return false;
  }
  if (UNFURL_UA.test(ua)) return true;
  const category = request.headers.get("netlify-agent-category") || "";
  return /page-preview/i.test(category) && !BROWSER_ENGINE.test(ua);
};

const apiBase = () => {
  try {
    return String(Netlify.env.get("REACT_APP_BASE_URL") || "")
      .trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\/+$/, "");
  } catch (error) {
    return "";
  }
};

const shareHtml = ({ title, description, image, pageUrl }) => {
  const meta = (property, content) =>
    content ? `<meta property="${property}" content="${escapeHtml(content)}" />` : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  ${meta("og:type", "profile")}
  ${meta("og:site_name", "Yuvadarpan")}
  ${meta("og:title", title)}
  ${meta("og:description", description)}
  ${meta("og:url", pageUrl)}
  ${meta("og:image", image)}
  ${meta("og:image:alt", title)}
  <meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  ${image ? `<meta name="twitter:image" content="${escapeHtml(image)}" />` : ""}
</head>
<body>
  ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />` : ""}
  <h1>${escapeHtml(title)}</h1>
  <p>${escapeHtml(description)}</p>
  <a href="${escapeHtml(pageUrl)}">Yuvadarpan</a>
</body>
</html>`;
};

export default async (request, context) => {
  if (!isPreview(request)) return context.next();

  const url = new URL(request.url);
  const match = url.pathname.match(/^\/yuva\/([^/]+)\/?$/);
  let id = match ? match[1] : "";
  try {
    id = decodeURIComponent(id);
  } catch (error) {
    id = "";
  }
  if (!/^[A-Za-z0-9_-]{1,80}$/.test(id)) return context.next();

  const base = apiBase();
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
      [textOf(yuva?.firstName), textOf(yuva?.fatherName), textOf(labels.lastName) || textOf(yuva?.lastName)]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() || "Yuvadarpan";
    const description =
      [textOf(labels.city) || textOf(yuva?.city), textOf(labels.state) || textOf(yuva?.state)]
        .filter(Boolean)
        .join(", ") || "Yuvadarpan";
    const photo = typeof yuva?.profile === "string" ? yuva.profile : yuva?.profile?.url;
    const image = /^https?:\/\//i.test(photo || "") ? photo : "";
    const pageUrl = new URL(request.url);
    pageUrl.searchParams.delete("preview");
    pageUrl.hash = "";
    return new Response(shareHtml({ title, description, image, pageUrl: pageUrl.toString() }), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "private, no-store",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  } catch (error) {
    return context.next();
  }
};

export const config = {
  path: "/yuva/*",
  onError: "bypass",
};
