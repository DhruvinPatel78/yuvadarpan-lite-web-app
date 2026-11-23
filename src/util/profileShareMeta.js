const META_ATTR = "data-yuva-og";

const absoluteUrl = (value, fallback = "") => {
  const raw = String(value || "").trim();
  if (!raw) return fallback;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (raw.startsWith("//")) return `https:${raw}`;
  if (typeof window !== "undefined" && raw.startsWith("/")) {
    return `${window.location.origin}${raw}`;
  }
  return fallback;
};

export const defaultOgImageUrl = () => {
  if (typeof window === "undefined") {
    return "/default-og-user.png";
  }
  return `${window.location.origin}/default-og-user.png`;
};

export const profileOgImageUrl = (profileId, photoUrl = "") => {
  const id = String(profileId || "")
    .replace(/\.jpe?g$/i, "")
    .trim();
  const rawPhoto = String(photoUrl || "").trim();
  if (rawPhoto && /^https?:\/\//i.test(rawPhoto)) {
    const params = new URLSearchParams({
      url: rawPhoto.replace(/^https?:\/\//i, ""),
      w: "1200",
      h: "630",
      fit: "cover",
      a: "attention",
      output: "jpg",
      q: "85",
    });
    return `https://images.weserv.nl/?${params.toString()}`;
  }
  if (!id) {
    return defaultOgImageUrl().replace(/\.png$/i, ".jpg");
  }
  if (typeof window === "undefined") {
    return `/og-image/${encodeURIComponent(id)}.jpg`;
  }
  return `${window.location.origin}/og-image/${encodeURIComponent(id)}.jpg`;
};

export const buildProfileShareMeta = ({
  fullName,
  familyId,
  locationLabel,
  activity,
  gender,
  photoUrl,
  shareUrl,
  profileId,
}) => {
  const title = String(fullName || "").trim() || "Yuvadarpan Profile";
  const parts = [];
  if (familyId) parts.push(`Family ID ${familyId}`);
  if (locationLabel && locationLabel !== "-") parts.push(locationLabel);
  if (activity) parts.push(activity);
  if (gender) parts.push(gender);
  parts.push("Yuvadarpan profile");

  const idFromShare = String(shareUrl || "")
    .split("/yuva/")[1]
    ?.split(/[?#]/)[0];
  const image = profileOgImageUrl(profileId || idFromShare, photoUrl);

  return {
    title,
    description: parts.filter(Boolean).join(" · "),
    // Never point crawlers at raw S3 WebP; use JPEG (weserv / proxy).
    image: image || absoluteUrl(photoUrl, "") || defaultOgImageUrl().replace(/\.png$/i, ".jpg"),
    imageWidth: 1200,
    imageHeight: 630,
    imageType: "image/jpeg",
    url: absoluteUrl(
      shareUrl,
      typeof window !== "undefined" ? window.location.href : ""
    ),
    siteName: "Yuvadarpan",
  };
};

const upsertMeta = (selector, attributes) => {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== "content") node.setAttribute(key, value);
    });
    node.setAttribute(META_ATTR, "true");
    document.head.appendChild(node);
  }
  if (attributes.content != null) {
    node.setAttribute("content", attributes.content);
  }
  node.setAttribute(META_ATTR, "true");
  return node;
};

const upsertLink = (rel, href) => {
  let node = document.head.querySelector(`link[rel="${rel}"]`);
  if (!node) {
    node = document.createElement("link");
    node.setAttribute("rel", rel);
    node.setAttribute(META_ATTR, "true");
    document.head.appendChild(node);
  }
  node.setAttribute("href", href);
  node.setAttribute(META_ATTR, "true");
};

export const applyProfileShareMeta = (meta) => {
  if (typeof document === "undefined" || !meta) return;
  const previousTitle = document.title;
  document.title = meta.title;

  upsertMeta('meta[name="description"]', {
    name: "description",
    content: meta.description,
  });
  upsertLink("canonical", meta.url);

  upsertMeta('meta[property="og:type"]', {
    property: "og:type",
    content: "profile",
  });
  upsertMeta('meta[property="og:site_name"]', {
    property: "og:site_name",
    content: meta.siteName || "Yuvadarpan",
  });
  upsertMeta('meta[property="og:title"]', {
    property: "og:title",
    content: meta.title,
  });
  upsertMeta('meta[property="og:description"]', {
    property: "og:description",
    content: meta.description,
  });
  upsertMeta('meta[property="og:image"]', {
    property: "og:image",
    content: meta.image,
  });
  upsertMeta('meta[property="og:image:secure_url"]', {
    property: "og:image:secure_url",
    content: meta.image,
  });
  upsertMeta('meta[property="og:image:type"]', {
    property: "og:image:type",
    content: meta.imageType || "image/jpeg",
  });
  upsertMeta('meta[property="og:image:width"]', {
    property: "og:image:width",
    content: String(meta.imageWidth || 1200),
  });
  upsertMeta('meta[property="og:image:height"]', {
    property: "og:image:height",
    content: String(meta.imageHeight || 630),
  });
  upsertMeta('meta[property="og:image:alt"]', {
    property: "og:image:alt",
    content: meta.title,
  });
  upsertMeta('meta[property="og:url"]', {
    property: "og:url",
    content: meta.url,
  });
  upsertMeta('meta[name="twitter:card"]', {
    name: "twitter:card",
    content: "summary_large_image",
  });
  upsertMeta('meta[name="twitter:title"]', {
    name: "twitter:title",
    content: meta.title,
  });
  upsertMeta('meta[name="twitter:description"]', {
    name: "twitter:description",
    content: meta.description,
  });
  upsertMeta('meta[name="twitter:image"]', {
    name: "twitter:image",
    content: meta.image,
  });

  return previousTitle;
};

export const clearProfileShareMeta = (previousTitle = "Yuvadarpan") => {
  if (typeof document === "undefined") return;
  document.querySelectorAll(`[${META_ATTR}="true"]`).forEach((node) => {
    node.remove();
  });
  document.title = previousTitle || "Yuvadarpan";
  const description = document.createElement("meta");
  description.setAttribute("name", "description");
  description.setAttribute(
    "content",
    "Yuvadarpan community directory and member portal."
  );
  document.head.appendChild(description);
};
