const {
  apiBase,
  fetchProfileMeta,
  buildWeservJpeg,
} = require("./yuva-og-meta");

const CACHE = "public, max-age=86400, stale-while-revalidate=604800";

const siteBase = (event) => {
  const headers = event.headers || {};
  const host = headers["x-forwarded-host"] || headers.host || "";
  if (host) {
    const proto = headers["x-forwarded-proto"] || "https";
    return `${proto}://${host}`.replace(/\/+$/, "");
  }
  return String(process.env.URL || "https://yuvadarpan.in")
    .trim()
    .replace(/\/+$/, "");
};

const extractId = (event) => {
  const path = event.path || "";
  const match = path.match(/\/og-image\/([^/?#]+)/i);
  const raw = match?.[1] || event.queryStringParameters?.id || "";
  return decodeURIComponent(String(raw)).replace(/\.jpe?g$/i, "").trim();
};

const asBase64Image = async (url) => {
  const response = await fetch(url, {
    headers: { Accept: "image/jpeg,image/png,image/webp,image/*;q=0.8" },
    redirect: "follow",
  });
  if (!response.ok) {
    return null;
  }
  const contentType = response.headers.get("content-type") || "image/jpeg";
  if (!contentType.startsWith("image/")) {
    return null;
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (!buffer.length) return null;
  return { contentType, buffer };
};

exports.handler = async (event) => {
  const id = extractId(event);
  const site = siteBase(event);
  if (!id) {
    return { statusCode: 404, body: "Missing profile id" };
  }

  try {
    // 1) Backend JPEG banner when deployed.
    const backendImage = await asBase64Image(
      `${apiBase()}/yuvaList/og-image/${encodeURIComponent(id)}.jpg`
    );
    if (backendImage) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": backendImage.contentType || "image/jpeg",
          "Cache-Control": CACHE,
          "Access-Control-Allow-Origin": "*",
        },
        body: backendImage.buffer.toString("base64"),
        isBase64Encoded: true,
      };
    }

    // 2) Convert live profile photo (often WebP) to JPEG via image proxy.
    const meta = await fetchProfileMeta(id, site);
    const proxied = buildWeservJpeg(meta.photoUrl || meta.sourcePhoto);
    if (proxied) {
      const converted = await asBase64Image(proxied);
      if (converted) {
        return {
          statusCode: 200,
          headers: {
            "Content-Type": "image/jpeg",
            "Cache-Control": CACHE,
            "Access-Control-Allow-Origin": "*",
          },
          body: converted.buffer.toString("base64"),
          isBase64Encoded: true,
        };
      }
    }

    // 3) Site default banner.
    const fallback = await asBase64Image(`${site}/default-og-user.jpg`);
    if (fallback) {
      return {
        statusCode: 200,
        headers: {
          "Content-Type": "image/jpeg",
          "Cache-Control": CACHE,
          "Access-Control-Allow-Origin": "*",
        },
        body: fallback.buffer.toString("base64"),
        isBase64Encoded: true,
      };
    }

    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "Profile image not found",
    };
  } catch (error) {
    console.error("yuva-og-image failed", error?.message || error);
    return {
      statusCode: 502,
      headers: { "Content-Type": "text/plain" },
      body: "Could not load profile image",
    };
  }
};
