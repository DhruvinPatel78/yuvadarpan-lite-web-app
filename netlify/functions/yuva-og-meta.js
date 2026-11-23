const pairText = (value, lang = "gu") => {
  if (value == null || value === "") return "";
  if (typeof value === "object" && !Array.isArray(value)) {
    if (lang === "gu" && value.gu) return String(value.gu).trim();
    return String(value.en || value.gu || value.name || "").trim();
  }
  return String(value).trim();
};

const labelText = (labels, key, lang = "gu") => {
  const value = labels?.[key];
  if (!value) return "";
  if (typeof value === "string") return value.trim();
  return pairText(value, lang) || pairText(value, "en");
};

const apiBase = () =>
  String(
    process.env.API_BASE_URL ||
      process.env.REACT_APP_BASE_URL ||
      "https://yuvadarpan-lite-backend.onrender.com"
  )
    .trim()
    .replace(/\/+$/, "");

const buildJpegProxy = (site, id) =>
  `${site}/og-image/${encodeURIComponent(id)}.jpg`;

const buildWeservJpeg = (photoUrl) => {
  const raw = String(photoUrl || "").trim();
  if (!raw || !/^https?:\/\//i.test(raw)) return "";
  // Convert S3 WebP (and other formats) to a WhatsApp-friendly JPEG banner.
  const params = new URLSearchParams({
    url: raw.replace(/^https?:\/\//i, ""),
    w: "1200",
    h: "630",
    fit: "cover",
    a: "attention",
    output: "jpg",
    q: "85",
  });
  return `https://images.weserv.nl/?${params.toString()}`;
};

const buildMetaFromYuva = (yuva, site, id) => {
  const firstName = pairText(yuva?.firstName, "gu") || pairText(yuva?.firstName, "en");
  const fatherName =
    pairText(yuva?.fatherName, "gu") || pairText(yuva?.fatherName, "en");
  const lastName =
    labelText(yuva?.labels, "lastName", "gu") ||
    labelText(yuva?.labels, "lastName", "en") ||
    pairText(yuva?.lastName, "gu") ||
    pairText(yuva?.lastName, "en");
  const fullName = [firstName, fatherName, lastName].filter(Boolean).join(" ");
  const city = labelText(yuva?.labels, "city", "gu") || labelText(yuva?.labels, "city", "en");
  const state =
    labelText(yuva?.labels, "state", "gu") || labelText(yuva?.labels, "state", "en");
  const activity = pairText(yuva?.activity, "gu") || pairText(yuva?.activity, "en");
  const gender = pairText(yuva?.gender, "gu") || pairText(yuva?.gender, "en");
  const location = [city, state].filter(Boolean).join(", ");

  const parts = [];
  if (yuva?.familyId) parts.push(`Family ID ${yuva.familyId}`);
  if (location) parts.push(location);
  if (activity) parts.push(activity);
  if (gender) parts.push(gender);
  parts.push("Yuvadarpan profile");

  const photoUrl = String(yuva?.profile?.url || "").trim();
  // Prefer a publicly fetchable JPEG. WhatsApp often skips S3 WebP.
  // 1) same-origin proxy  2) weserv JPEG of profile photo  3) default banner
  const weservImage = buildWeservJpeg(photoUrl);
  const image =
    weservImage ||
    buildJpegProxy(site, id) ||
    `${site}/default-og-user.jpg`;

  return {
    title: fullName || "Yuvadarpan Profile",
    description: parts.filter(Boolean).join(" · "),
    image,
    fallbackImage:
      buildJpegProxy(site, id) || `${site}/default-og-user.jpg`,
    photoUrl,
    imageWidth: 1200,
    imageHeight: 630,
    imageType: "image/jpeg",
    url: `${site}/yuva/${encodeURIComponent(id)}`,
    siteName: "Yuvadarpan",
    fullName,
  };
};

const defaultMeta = (site, id) => ({
  title: "Yuvadarpan Profile",
  description: "Yuvadarpan community directory profile.",
  image: `${site}/default-og-user.jpg`,
  fallbackImage: `${site}/default-og-user.jpg`,
  photoUrl: "",
  imageWidth: 1200,
  imageHeight: 630,
  imageType: "image/jpeg",
  url: `${site}/yuva/${encodeURIComponent(id)}`,
  siteName: "Yuvadarpan",
  fullName: "",
});

const fetchProfileMeta = async (id, site) => {
  const base = apiBase();
  // Prefer dedicated OG endpoint when backend is deployed.
  try {
    const ogRes = await fetch(`${base}/yuvaList/og/${encodeURIComponent(id)}`, {
      headers: { Accept: "application/json" },
    });
    if (ogRes.ok) {
      const data = await ogRes.json();
      const fallback = defaultMeta(site, id);
      const weservImage = buildWeservJpeg(data.sourcePhoto);
      return {
        ...fallback,
        ...data,
        image:
          weservImage ||
          buildJpegProxy(site, id) ||
          data.image ||
          fallback.image,
        fallbackImage: buildJpegProxy(site, id) || fallback.image,
        photoUrl: data.sourcePhoto || "",
        url: `${site}/yuva/${encodeURIComponent(id)}`,
      };
    }
  } catch (error) {
    console.error("og endpoint unavailable", error?.message || error);
  }

  // Fallback: already-live public profile API.
  try {
    const response = await fetch(
      `${base}/yuvaList/public/${encodeURIComponent(id)}`,
      { headers: { Accept: "application/json" } }
    );
    if (!response.ok) {
      return defaultMeta(site, id);
    }
    const yuva = await response.json();
    return buildMetaFromYuva(yuva, site, id);
  } catch (error) {
    console.error("public profile fetch failed", error?.message || error);
    return defaultMeta(site, id);
  }
};

module.exports = {
  apiBase,
  fetchProfileMeta,
  defaultMeta,
  buildJpegProxy,
  buildWeservJpeg,
  pairText,
  labelText,
};
