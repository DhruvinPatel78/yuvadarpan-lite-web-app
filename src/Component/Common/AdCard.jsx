import React, { useEffect, useState } from "react";

/**
 * Advertisement card matching yuva card height.
 * Image is contained and centered (not stretched).
 * Details sit bottom-left on a theme-color gradient.
 */
const AdCard = ({ ad, className = "" }) => {
  const imageUrl =
    typeof ad?.image?.url === "string" ? ad.image.url.trim() : "";
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [imageUrl]);

  if (!ad) {
    return null;
  }

  const linkLabel = ad.websiteLink
    ? ad.websiteLink.replace(/^https?:\/\//i, "")
    : "";

  const content = (
    <div
      className={`group relative w-full h-full min-h-[280px] min-w-0 rounded-xl overflow-hidden bg-muted border-2 border-solid border-line-strong md:border md:border-line shadow-card hover:border-primary transition-colors duration-200 ${className}`.trim()}
    >
      {imageUrl && !failed ? (
        <img
          src={imageUrl}
          alt={ad.name || "Advertisement"}
          className="absolute inset-0 m-auto max-w-full max-h-full w-full h-full object-contain object-center p-3 transition-transform duration-300 group-hover:scale-[1.02]"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-mutedText">
          Ad
        </div>
      )}

      <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide bg-primary text-white shadow-card">
        AD
      </span>

      {(ad.name || linkLabel) && (
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-primary via-primary/85 to-transparent pt-14">
          <div className="px-3.5 pb-3.5 pr-12 max-w-full text-left">
            {ad.name ? (
              <h2 className="text-[15px] font-semibold text-white leading-snug line-clamp-2">
                {ad.name}
              </h2>
            ) : null}
            {linkLabel ? (
              <p className="mt-1 text-sm text-white/85 truncate">{linkLabel}</p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  if (ad.websiteLink) {
    return (
      <a
        href={ad.websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ad.name || "Advertisement"}
        className="block w-full h-full no-underline text-inherit"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default AdCard;
