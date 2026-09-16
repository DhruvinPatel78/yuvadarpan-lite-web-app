import React, { useLayoutEffect, useRef, useState } from "react";
import { CircularProgress } from "@mui/material";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import {
  DEFAULT_USER_IMAGE,
  getUserImageSrc,
} from "../../util/defaultUserImage";

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
  const requestedSrc = typeof src === "string" ? src.trim() : src || "";
  const [currentSrc, setCurrentSrc] = useState(requestedSrc);
  const [failedOriginal, setFailedOriginal] = useState(false);
  const [status, setStatus] = useState(requestedSrc ? "loading" : "loaded");
  const displaySrc = failedOriginal
    ? DEFAULT_USER_IMAGE
    : getUserImageSrc(requestedSrc);
  const isDefault = displaySrc === DEFAULT_USER_IMAGE;

  if (requestedSrc !== currentSrc) {
    setCurrentSrc(requestedSrc);
    setFailedOriginal(false);
    setStatus(requestedSrc ? "loading" : "loaded");
  }

  useLayoutEffect(() => {
    const node = imgRef.current;
    if (displaySrc && node && node.complete && node.naturalWidth > 0) {
      setStatus("loaded");
    }
  }, [displaySrc]);

  const loaded = status === "loaded";
  const showSpinner = Boolean(requestedSrc) && !failedOriginal && status === "loading";
  const showFallback = status === "error" && isDefault;

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
      {displaySrc && status !== "error" ? (
        <img
          ref={imgRef}
          src={displaySrc}
          alt={alt}
          onLoad={(event) => {
            if (event.currentTarget.naturalWidth > 0) {
              setStatus("loaded");
            }
          }}
          onError={() => {
            if (!isDefault) {
              setFailedOriginal(true);
              setStatus("loading");
              return;
            }
            setStatus("error");
          }}
          loading={eager || isDefault ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          className={`${imgClassName} ${
            loaded || isDefault
              ? "scale-100 blur-0 opacity-100"
              : "scale-110 blur-xl opacity-80"
          } origin-center transition-[filter,transform,opacity] duration-500 ease-out`}
          style={{ objectFit: fit }}
        />
      ) : null}
    </div>
  );
};

export default LoadableImage;
