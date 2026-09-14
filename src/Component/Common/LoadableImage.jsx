import React, { useLayoutEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

const LoadableImage = ({
  src,
  alt = "",
  className = "",
  imgClassName = "w-full h-full object-cover",
  eager = false,
  fit = "cover",
  spinnerSize = 28,
}) => {
  const imgRef = useRef(null);
  const [currentSrc, setCurrentSrc] = useState(src);
  const [status, setStatus] = useState(src ? "loading" : "empty");

  if (src !== currentSrc) {
    setCurrentSrc(src);
    setStatus(src ? "loading" : "empty");
  }

  useLayoutEffect(() => {
    const node = imgRef.current;
    if (src && node && node.complete && node.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, [src]);

  const loaded = status === "loaded";
  const showSpinner = Boolean(src) && status === "loading";
  const showFallback = !src || status === "error" || status === "empty";

  return (
    <div className={`relative overflow-hidden bg-[#f3ece9] ${className}`}>
      {showSpinner ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          role="status"
          aria-label="Loading photo"
        >
          <CircularProgress
            size={spinnerSize}
            thickness={4}
            sx={{ color: "#542b2b" }}
          />
        </div>
      ) : null}
      {showFallback ? (
        <div
          className="absolute inset-0 z-[1] flex items-center justify-center text-[#542b2b]/35"
          aria-hidden="true"
        >
          <PersonOutlineIcon sx={{ width: "46%", height: "46%" }} />
        </div>
      ) : null}
      {src && status !== "error" ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth > 0) {
              setStatus("loaded");
            }
          }}
          onError={() => setStatus("error")}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          className={`${imgClassName} ${
            loaded ? "scale-100 blur-0 opacity-100" : "scale-110 blur-xl opacity-80"
          } origin-center transition-[filter,transform,opacity] duration-500 ease-out`}
          style={{ objectFit: fit }}
        />
      ) : null}
    </div>
  );
};

export default LoadableImage;
