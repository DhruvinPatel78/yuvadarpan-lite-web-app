import React from "react";
import Box from "@mui/material/Box";

const FullPageLoader = () => {
  return (
    <Box
      role="alert"
      aria-busy="true"
      aria-label="Loading YUVADARPAN content"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-95"
    >
      <svg
        className="w-[80vw] h-[15vh] max-w-[400px] max-h-[80px]"
        viewBox="0 0 400 80"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="shimmerGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#542b2b" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#a36767" stopOpacity="1" />
            <stop offset="100%" stopColor="#542b2b" stopOpacity="0.2" />
          </linearGradient>
          <mask id="text-mask">
            <text
              x="50%"
              y="50%"
              dominantBaseline="middle"
              textAnchor="middle"
              fontSize="clamp(30px, 10vw, 50px)"
              fontWeight="700"
              fontFamily="Poppins, sans-serif"
              fill="white"
              letterSpacing="4"
              style={{ textTransform: "uppercase" }}
            >
              YUVADARPAN
            </text>
          </mask>
        </defs>

        <rect
          width="400"
          height="80"
          fill="url(#shimmerGradient)"
          mask="url(#text-mask)"
        >
          <animate
            attributeName="x"
            values="-400;400"
            dur="3.5s"
            repeatCount="indefinite"
          />
        </rect>

        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          fontSize="clamp(30px, 10vw, 50px)"
          fontWeight="700"
          fontFamily="Poppins, sans-serif"
          fill="none"
          stroke="#542b2b"
          strokeWidth="1.5"
          letterSpacing="4"
          style={{ userSelect: "none", textTransform: "uppercase" }}
        >
          YUVADARPAN
        </text>
      </svg>
    </Box>
  );
};

export default FullPageLoader;
