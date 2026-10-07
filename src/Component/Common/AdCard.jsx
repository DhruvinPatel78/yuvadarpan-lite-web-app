import React, { useEffect, useState } from "react";

/**
 * Modern, unique advertisement card designed to fit seamlessly alongside profile cards.
 * Uses edge-to-edge image fill, golden accent border glow, glassmorphic SPONSORED badge,
 * diagonal sheen sweep, and hover CTA pill while keeping title/URL text hidden.
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
      className={`group relative w-full h-full min-h-[290px] min-w-0 rounded-2xl overflow-hidden bg-gradient-to-b from-[#fffcf8] via-surface to-[#fdf8f2] border-2 border-amber-500/35 shadow-sm hover:shadow-[0_12px_32px_rgba(217,119,6,0.2)] hover:border-amber-500/70 transition-all duration-300 transform hover:-translate-y-1 ${className}`.trim()}
    >
      {imageUrl && !failed ? (
        <>
          <img
            src={imageUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover filter blur-xl scale-125 opacity-40 transform group-hover:scale-150 transition-transform duration-700 ease-out"
          />
          <img
            src={imageUrl}
            alt="Advertisement"
            className="relative z-10 w-full h-full object-contain p-2.5 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            onError={() => setFailed(true)}
          />

          <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-sm font-medium text-mutedText bg-muted/30">
          <span className="text-xs uppercase tracking-widest text-primary/70 font-semibold">
            Advertisement
          </span>
        </div>
      )}

      <div className="absolute top-3 right-3 z-30 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-600/95 to-amber-700/95 backdrop-blur-md border border-amber-300/40 text-white text-[10px] font-extrabold tracking-widest uppercase shadow-md pointer-events-none group-hover:scale-105 transition-all">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        AD
      </div>

    </div>
  );

  if (ad.websiteLink) {
    return (
      <a
        href={ad.websiteLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Advertisement"
        className="block w-full h-full no-underline text-inherit"
      >
        {content}
      </a>
    );
  }

  return content;
};

export default AdCard;
