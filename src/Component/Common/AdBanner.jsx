import React, { useEffect, useState } from "react";
import { getAdvertisementsByPage } from "../../util/advertisementApi";
import AdCard from "./AdCard";

/** Stable priority order: 1st, 2nd, 3rd… then id. */
export const sortAdsByPriority = (list = []) =>
  [...list].sort((a, b) => {
    const pa = Number(a?.priority);
    const pb = Number(b?.priority);
    const aOk = Number.isFinite(pa);
    const bOk = Number.isFinite(pb);
    if (aOk && bOk && pa !== pb) return pa - pb;
    if (aOk && !bOk) return -1;
    if (!aOk && bOk) return 1;
    return String(a?.id || a?.uuid || "").localeCompare(
      String(b?.id || b?.uuid || "")
    );
  });

/**
 * Loads ads for a page. Optional fallback pages if primary has no / few ads.
 * Always returns ads sorted by priority (never shuffled).
 */
export const usePageAds = (page, { fallbackPages = [] } = {}) => {
  const [ads, setAds] = useState([]);
  const fallbackKey = Array.isArray(fallbackPages)
    ? fallbackPages.join("|")
    : "";

  useEffect(() => {
    let active = true;
    if (!page) {
      setAds([]);
      return undefined;
    }
    const load = async () => {
      try {
        const pages = [page, ...(fallbackPages || [])].filter(Boolean);
        const seen = new Map();
        for (const key of pages) {
          const rows = await getAdvertisementsByPage(key);
          (Array.isArray(rows) ? rows : []).forEach((row) => {
            const adId = row?.id || row?.uuid || row?._id;
            const imageUrl =
              typeof row?.image?.url === "string" ? row.image.url.trim() : "";
            if (imageUrl && adId && !seen.has(String(adId))) {
              seen.set(String(adId), { ...row, id: String(adId) });
            }
          });
          // Primary page: keep every ad. Fallbacks only fill up to 3.
          if (key === page) {
            continue;
          }
          if (seen.size >= 3) {
            break;
          }
        }
        if (active) {
          setAds(sortAdsByPriority([...seen.values()]));
        }
      } catch {
        if (active) setAds([]);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [page, fallbackKey]);

  return ads;
};

/**
 * Insert ads into a yuva list every N items, in fixed priority order.
 * Same inputs always produce the same feed (no random).
 */
export const interleaveAdsIntoList = (yuvaRows = [], ads = [], every = 4) => {
  const orderedAds = sortAdsByPriority(ads);
  if (!orderedAds.length) {
    return yuvaRows.map((row) => ({ type: "yuva", data: row }));
  }

  const result = [];
  let adIndex = 0;
  const spacing = Math.max(2, every);

  yuvaRows.forEach((row, index) => {
    result.push({ type: "yuva", data: row });
    if ((index + 1) % spacing === 0 && adIndex < orderedAds.length) {
      result.push({ type: "ad", data: orderedAds[adIndex] });
      adIndex += 1;
    }
  });

  // Remaining ads stay in priority order at the end (still not random).
  while (adIndex < orderedAds.length) {
    result.push({ type: "ad", data: orderedAds[adIndex] });
    adIndex += 1;
  }

  return result;
};

/** Compact banner (login/signup) — cycles ads. */
export const AdBanner = ({ page, className = "" }) => {
  const ads = usePageAds(page);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [ads]);

  useEffect(() => {
    if (ads.length <= 1) return undefined;
    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [ads]);

  if (!ads.length) {
    return null;
  }

  const current = ads[index] || ads[0];
  const content = (
    <div className="relative w-full">
      <img
        src={current.image.url}
        alt={current.name || "Advertisement"}
        className="w-full max-h-40 object-contain rounded-lg bg-white"
      />
      <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide bg-primary text-white shadow-card">
        AD
      </span>
    </div>
  );

  return (
    <div className={`w-full ${className}`.trim()}>
      {current.websiteLink ? (
        <a
          href={current.websiteLink}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={current.name || "Advertisement"}
        >
          {content}
        </a>
      ) : (
        content
      )}
      {ads.length > 1 ? (
        <div className="flex justify-center gap-1.5 mt-2">
          {ads.map((ad, i) => (
            <button
              key={ad.id || i}
              type="button"
              aria-label={`Show advertisement ${i + 1}`}
              className={`h-1.5 w-1.5 rounded-full ${
                i === index ? "bg-primary" : "bg-line"
              }`}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

/** Two ads side-by-side. Pass `ads` to reuse a loaded list, or `page` to fetch. */
export const AdPairRow = ({
  page,
  ads: adsProp,
  className = "",
  offset = 0,
  fallbackPages = [],
}) => {
  const fetchedAds = usePageAds(page, { fallbackPages });
  const ads = Array.isArray(adsProp) ? adsProp : fetchedAds;
  const pair = ads.slice(offset, offset + 2);
  if (!pair.length) {
    return null;
  }
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 gap-4 w-full ${className}`.trim()}
    >
      {pair.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
      {pair.length === 1 ? <div className="hidden sm:block" /> : null}
    </div>
  );
};

export default AdBanner;
