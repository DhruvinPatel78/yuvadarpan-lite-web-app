import React, { useEffect, useState } from "react";

/**
 * Advertisement card with AD badge (no profile-photo fallback).
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

  const content = (
    <div
      className={`group w-full min-w-0 rounded-xl overflow-hidden bg-white border-2 border-solid border-line-strong md:border md:border-line shadow-card hover:border-primary transition-colors duration-200 flex flex-col ${className}`.trim()}
    >
      <div className="aspect-[5/4] bg-muted overflow-hidden relative">
        {imageUrl && !failed ? (
          <img
            src={imageUrl}
            alt={ad.name || "Advertisement"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            onError={() => setFailed(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sm text-mutedText">
            Ad
          </div>
        )}
        <span className="absolute top-2 right-2 z-10 px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide bg-primary text-white shadow-card">
          AD
        </span>
      </div>
      {ad.name ? (
        <div className="px-3.5 pt-3.5 pb-3.5 flex flex-col flex-1 min-w-0">
          <h2 className="text-[15px] font-semibold text-primary leading-snug line-clamp-2">
            {ad.name}
          </h2>
          {ad.websiteLink ? (
            <p className="mt-2 text-sm text-mutedText truncate">
              {ad.websiteLink.replace(/^https?:\/\//i, "")}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );

  if (ad.websiteLink) {
    return (
      <a
        href={ad.websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ad.name || "Advertisement"}
        className="block w-full no-underline text-inherit"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default AdCard;
