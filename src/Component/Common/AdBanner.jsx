import React, { useEffect, useRef, useState } from "react";
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
 * Put one ad beside profile cards. The ad slot moves each row so two ads
 * never sit side by side. Extra ads wait until more profiles can separate them.
 */
export const placeAdsBesideProfiles = (profiles = [], ads = [], columns = 4) => {
  const cols = Math.max(1, Number(columns) || 1);
  const people = Array.isArray(profiles) ? profiles : [];
  const posters = Array.isArray(ads) ? ads : [];

  if (!posters.length) {
    return people.map((data) => ({ type: "yuva", data }));
  }
  if (!people.length) {
    return [];
  }

  const items = [];
  let profileIndex = 0;
  let adIndex = 0;

  if (cols === 1) {
    while (profileIndex < people.length) {
      items.push({ type: "yuva", data: people[profileIndex] });
      profileIndex += 1;
      if (adIndex < posters.length && profileIndex < people.length) {
        items.push({ type: "ad", data: posters[adIndex] });
        adIndex += 1;
      }
    }
    if (people.length === 1 && adIndex < posters.length) {
      items.push({ type: "ad", data: posters[adIndex] });
    }
    return items;
  }
  let adColumn = cols - 1;
  let gapRow = false;
  while (profileIndex < people.length) {
    const peopleLeft = people.length - profileIndex;
    const wantAd = !gapRow && adIndex < posters.length;
    const profileSlots = wantAd ? cols - 1 : cols;
    const take = Math.min(profileSlots, peopleLeft);
    if (!wantAd) {
      for (let i = 0; i < take; i += 1) {
        items.push({ type: "yuva", data: people[profileIndex] });
        profileIndex += 1;
      }
      gapRow = false;
      continue;
    }

    if (take < cols - 1) {
      for (let i = 0; i < take; i += 1) {
        items.push({ type: "yuva", data: people[profileIndex] });
        profileIndex += 1;
      }
      items.push({ type: "ad", data: posters[adIndex] });
      break;
    }

    const rowProfiles = [];
    for (let i = 0; i < cols - 1; i += 1) {
      rowProfiles.push(people[profileIndex]);
      profileIndex += 1;
    }
    let rowProfileIndex = 0;
    for (let column = 0; column < cols; column += 1) {
      if (column === adColumn) {
        items.push({ type: "ad", data: posters[adIndex] });
        adIndex += 1;
      } else {
        items.push({ type: "yuva", data: rowProfiles[rowProfileIndex] });
        rowProfileIndex += 1;
      }
    }
    adColumn = (adColumn - 1 + cols) % cols;
    if (cols <= 2) {
      gapRow = true;
    }
  }

  return items;
};

/**
 * Horizontal shelf of separate ad posters.
 * Several show at once. The user scrolls to the rest. Nothing auto-rotates.
 */
export const AdShelf = ({ ads = [], title = "Sponsored" }) => {
  const scrollerRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 8);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
  };

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return undefined;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [ads]);

  if (!ads.length) return null;

  const scrollByCard = (direction) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector("[data-ad-card]");
    const amount = (card?.getBoundingClientRect().width || 220) + 16;
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  return (
    <section aria-label={title || "Advertisements"} className="mb-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="h-2 w-2 shrink-0 rounded-full bg-amber-500" />
          <h2 className="text-sm font-WorkSemiBold tracking-wide text-primary truncate">
            {title}
          </h2>
        </div>
        {canPrev || canNext ? (
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              aria-label="Show previous advertisements"
              disabled={!canPrev}
              onClick={() => scrollByCard(-1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-primary shadow-sm transition-colors hover:bg-[#f6f6fa] disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M10 3.5 5.5 8 10 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Show next advertisements"
              disabled={!canNext}
              onClick={() => scrollByCard(1)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-white text-primary shadow-sm transition-colors hover:bg-[#f6f6fa] disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : null}
      </div>
      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ads.map((ad, index) => (
          <div
            key={ad.id || ad.uuid || ad._id || index}
            data-ad-card
            className="snap-start shrink-0 w-[200px] sm:w-[230px] h-[280px] sm:h-[300px]"
          >
            <AdCard ad={ad} className="!h-full !min-h-0" />
          </div>
        ))}
      </div>
    </section>
  );
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
  const imageUrl = typeof current?.image?.url === "string" ? current.image.url.trim() : "";
  const content = (
    <div className="group relative w-full h-40 rounded-2xl overflow-hidden shadow-sm border border-amber-500/25 bg-surface hover:border-amber-500/60 transition-all duration-300">
      {imageUrl ? (
        <>
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-40 transition-transform duration-700 group-hover:scale-150"
          />
          <img
            src={imageUrl}
            alt="Advertisement"
            className="relative z-0 w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-mutedText bg-muted/30">
          Advertisement
        </div>
      )}
      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600/95 to-amber-700/95 backdrop-blur-md border border-amber-300/40 text-white text-[10px] font-extrabold tracking-widest uppercase shadow-md pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        AD
      </div>
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
