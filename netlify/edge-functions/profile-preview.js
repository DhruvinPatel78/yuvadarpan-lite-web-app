const UNFURL_UA =
  /facebookexternalhit|Facebot|Twitterbot|LinkedInBot|Slackbot|TelegramBot|Discordbot|Pinterest|SkypeUriPreview|Iframely|embedly|Applebot|WhatsApp/i;
const BROWSER_ENGINE = /AppleWebKit|Chrome|Firefox|Edg\//i;

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const GU_CHOICES = {
  // Marital status
  single: "અપરિણીત",
  unmarried: "અપરિણીત",
  married: "પરણિત",
  engaged: "વગ્દાન",
  divorce: "છૂટાછેડા",
  divorced: "છૂટાછેડા",
  seprated: "અલગ થયેલા",
  separated: "અલગ થયેલા",
  widow: "વિધવા",
  widower: "વિધુર",

  // Gender
  male: "પુરુષ",
  female: "સ્ત્રી",

  // Activity / Occupation
  business: "વ્યવસાય",
  farming: "ખેતી",
  "job/service": "નોકરી / સેવા",
  job: "નોકરી",
  service: "સેવા",
  "job seeker": "નોકરી શોધનાર",
  study: "અભ્યાસ",
  student: "અભ્યાસ",
  child: "બાળક",
  "house hold": "ઘરકામ",
  household: "ઘરકામ",
  "house wife": "ગૃહિણી",
  housewife: "ગૃહિણી",
  "self employed": "સ્વરોજગાર",
  retired: "નિવૃત્ત",
  abroad: "વિદેશ",

  // Education
  "1st std": "ધોરણ ૧",
  "2nd std": "ધોરણ ૨",
  "3rd std": "ધોરણ ૩",
  "4th std": "ધોરણ ૪",
  "5th std": "ધોરણ ૫",
  "6th std": "ધોરણ ૬",
  "7th std": "ધોરણ ૭",
  "8th std": "ધોરણ ૮",
  "9th std": "ધોરણ ૯",
  "10th std (ssc)": "ધોરણ ૧૦ (SSC)",
  "10th std": "ધોરણ ૧૦ (SSC)",
  "10th": "ધોરણ ૧૦ (SSC)",
  ssc: "ધોરણ ૧૦ (SSC)",
  "11th std": "ધોરણ ૧૧",
  "12th std (hsc)": "ધોરણ ૧૨ (HSC)",
  "12th std": "ધોરણ ૧૨ (HSC)",
  "12th": "ધોરણ ૧૨ (HSC)",
  hsc: "ધોરણ ૧૨ (HSC)",
  diploma: "ડિપ્લોમા",
  graduate: "સ્નાતક",
  graduation: "સ્નાતક",
  bachelor: "સ્નાતક",
  bachelors: "સ્નાતક",
  "post graduate": "અનુસ્નાતક",
  postgraduate: "અનુસ્નાતક",
  "post graduation": "અનુસ્નાતક",
  master: "અનુસ્નાતક",
  masters: "અનુસ્નાતક",
  phd: "પીએચડી",
  "ph.d": "પીએચડી",
  doctorate: "પીએચડી",
  other: "અન્ય",

  // Common
  "not known": "જાણ નથી",
  yes: "હા",
  no: "ના",
};

const guChoice = (val) => {
  if (typeof val !== "string") return "";
  const key = val.trim().toLowerCase().replace(/^(marital|activity|education|relation)\./i, "");
  return GU_CHOICES[key] || "";
};

const textOf = (value, depth = 0) => {
  if (value == null || depth > 3) return "";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    const text = value.trim();
    if (/^[a-f0-9]{24}$/i.test(text) || /^[a-f0-9]{32}$/i.test(text)) return "";
    return guChoice(text) || text;
  }
  if (typeof value === "object" && !Array.isArray(value)) {
    return (
      textOf(value.gu, depth + 1) ||
      textOf(value.nameGu, depth + 1) ||
      (value.name && typeof value.name === "object" ? textOf(value.name, depth + 1) : "") ||
      textOf(value.en, depth + 1) ||
      textOf(value.nameEn, depth + 1) ||
      (typeof value.name === "string" ? textOf(value.name, depth + 1) : "") ||
      ""
    );
  }
  return "";
};

const educationOf = (edu) => {
  if (!edu) return "";
  if (typeof edu === "string") return textOf(edu);
  if (typeof edu === "object") {
    const main = textOf(edu.education || edu.name || edu.degree || edu.level);
    const field = textOf(edu.fieldOfStudy || edu.field || edu.stream);
    if (main && field) return `${main} (${field})`;
    return main || field || "";
  }
  return "";
};

const occupationOf = (yuva) => {
  const activity = textOf(yuva?.activity);
  const firm = textOf(yuva?.firm);
  if (activity && firm) return `${activity} - ${firm}`;
  return activity || firm || "";
};

const locationOf = (yuva, labels = {}) => {
  const city = textOf(labels?.city) || textOf(yuva?.city);
  const state = textOf(labels?.state) || textOf(yuva?.state);
  return [city, state].filter(Boolean).join(", ");
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
  const pageTitle = title && title !== "યુવાદર્પણ" ? `${title} - યુવાદર્પણ` : "યુવાદર્પણ";
  return `<!DOCTYPE html>
<html lang="gu">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex, nofollow" />
  <title>${escapeHtml(pageTitle)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  ${meta("og:type", "profile")}
  ${meta("og:site_name", "યુવાદર્પણ")}
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
  <a href="${escapeHtml(pageUrl)}">યુવાદર્પણ</a>
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
      [
        textOf(yuva?.firstName),
        textOf(yuva?.fatherName),
        textOf(labels.lastName) || textOf(yuva?.lastName),
      ]
        .filter(Boolean)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim() || "યુવાદર્પણ";

    const native = textOf(labels.native) || textOf(yuva?.native);
    const location = locationOf(yuva, labels);
    const edu = educationOf(yuva?.education);
    const occupation = occupationOf(yuva);
    const marital = textOf(yuva?.martialStatus);
    const samaj = textOf(labels.localSamaj) || textOf(yuva?.localSamaj);

    const details = [];
    if (native) details.push(`વતન: ${native}`);
    if (location) details.push(`સ્થળ: ${location}`);
    if (edu) details.push(`અભ્યાસ: ${edu}`);
    if (occupation) details.push(`વ્યવસાય: ${occupation}`);
    if (marital) details.push(`વૈવાહિક સ્થિતિ: ${marital}`);
    if (samaj) details.push(`સમાજ: ${samaj}`);

    const description = details.join(" • ") || "યુવાદર્પણ";
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
