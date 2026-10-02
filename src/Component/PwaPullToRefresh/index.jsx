import React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import RefreshIcon from "@mui/icons-material/Refresh";
import usePullToRefresh from "../../pwa/usePullToRefresh";

export default function PwaPullToRefresh() {
  const { pullDistance, refreshing, armed, visible } = usePullToRefresh();

  if (!visible) {
    return null;
  }

  const offset = Math.max(pullDistance, refreshing ? 72 : 0);

  return (
    <div
      className="pwa-pull-refresh"
      aria-live="polite"
      aria-busy={refreshing}
      style={{
        transform: `translate(-50%, ${Math.max(0, offset - 28)}px)`,
        opacity: Math.min(1, offset / 48),
      }}
    >
      <div
        className={`pwa-pull-refresh__chip${
          armed || refreshing ? " is-armed" : ""
        }`}
      >
        {refreshing ? (
          <CircularProgress size={22} thickness={4} sx={{ color: "#542b2b" }} />
        ) : (
          <RefreshIcon
            sx={{
              fontSize: 22,
              color: "#542b2b",
              transform: `rotate(${Math.min(180, pullDistance * 2.2)}deg)`,
              transition: "transform 0.05s linear",
            }}
          />
        )}
      </div>
      <span className="sr-only">
        {refreshing
          ? "Refreshing"
          : armed
            ? "Release to refresh"
            : "Pull to refresh"}
      </span>
    </div>
  );
}
