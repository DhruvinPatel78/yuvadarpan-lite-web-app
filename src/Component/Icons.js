import * as React from "react";

export const YuvadarpanLogo = ({
  maxHeight = 50,
  style = {},
  className = "",
  ariaLabel = "Yuvadarpan logo",
  onClick = () => {},
  fill = "#FFFFFF",
}) => {
  return (
    <svg
      viewBox="0 0 300 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={ariaLabel}
      className={className}
      style={{
        width: "100%",
        height: "auto",
        maxHeight: maxHeight,
        display: "block",
        ...style,
      }}
      preserveAspectRatio="xMidYMid meet"
      onClick={onClick}
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fill={fill}
        fontFamily="'Poppins', sans-serif"
        fontWeight="700"
        fontSize="36"
        letterSpacing="1"
        style={{ userSelect: "none" }}
      >
        YUVADARPAN
      </text>
    </svg>
  );
};
