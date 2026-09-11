import * as React from "react";

const brandFont = "WorkBold, 'Work Sans', sans-serif";

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
      preserveAspectRatio="xMinYMid meet"
      onClick={onClick}
    >
      <text
        x="0"
        y="50%"
        dominantBaseline="middle"
        textAnchor="start"
        fill={fill}
        fontFamily={brandFont}
        fontWeight="700"
        fontSize="42"
        letterSpacing="1.2"
        style={{ userSelect: "none" }}
      >
        YUVADARPAN
      </text>
    </svg>
  );
};
