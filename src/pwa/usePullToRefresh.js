import { useCallback, useEffect, useRef, useState } from "react";

const TRIGGER_DISTANCE = 72;
const MAX_PULL = 112;
const RESISTANCE = 0.42;

const isStandaloneDisplay = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches ||
    window.matchMedia("(display-mode: minimal-ui)").matches ||
    window.matchMedia("(display-mode: window-controls-overlay)").matches ||
    window.navigator.standalone === true
  );
};

const pageScrollTop = () =>
  Math.max(
    window.scrollY || 0,
    document.documentElement?.scrollTop || 0,
    document.body?.scrollTop || 0
  );

const isScrollable = (el) => {
  if (!(el instanceof Element)) return false;
  const style = window.getComputedStyle(el);
  const overflowY = style.overflowY;
  if (!/(auto|scroll|overlay)/.test(overflowY)) return false;
  return el.scrollHeight > el.clientHeight + 1;
};

const scrolledAncestorBlocksPull = (target) => {
  let node = target instanceof Element ? target : target?.parentElement;
  while (node && node !== document.body && node !== document.documentElement) {
    if (isScrollable(node) && node.scrollTop > 0) {
      return true;
    }
    node = node.parentElement;
  }
  return false;
};

const hasOpenOverlay = () =>
  Boolean(
    document.querySelector(
      ".MuiModal-root, .MuiDrawer-root, .MuiDialog-root, [aria-modal='true']"
    )
  );

export default function usePullToRefresh({
  enabled = true,
  onRefresh,
} = {}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const tracking = useRef(false);
  const pulling = useRef(false);
  const distanceRef = useRef(0);
  const refreshingRef = useRef(false);

  const setDistance = useCallback((value) => {
    distanceRef.current = value;
    setPullDistance(value);
  }, []);

  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    setRefreshing(true);
    setDistance(TRIGGER_DISTANCE);
    try {
      if (typeof onRefresh === "function") {
        await onRefresh();
      } else {
        window.location.reload();
      }
    } finally {
      // Full reload never reaches here; soft refresh does.
      refreshingRef.current = false;
      setRefreshing(false);
      setDistance(0);
    }
  }, [onRefresh, setDistance]);

  useEffect(() => {
    if (!enabled || !isStandaloneDisplay()) {
      return undefined;
    }

    const onTouchStart = (event) => {
      if (refreshingRef.current || hasOpenOverlay()) {
        tracking.current = false;
        return;
      }
      if (pageScrollTop() > 1) {
        tracking.current = false;
        return;
      }
      if (scrolledAncestorBlocksPull(event.target)) {
        tracking.current = false;
        return;
      }
      startY.current = event.touches[0].clientY;
      tracking.current = true;
      pulling.current = false;
    };

    const onTouchMove = (event) => {
      if (!tracking.current || refreshingRef.current) return;
      if (pageScrollTop() > 1) {
        tracking.current = false;
        setDistance(0);
        return;
      }
      const delta = event.touches[0].clientY - startY.current;
      if (delta <= 0) {
        pulling.current = false;
        setDistance(0);
        return;
      }
      pulling.current = true;
      const next = Math.min(delta * RESISTANCE, MAX_PULL);
      setDistance(next);
    };

    const onTouchEnd = () => {
      if (!tracking.current) return;
      tracking.current = false;
      const shouldRefresh =
        pulling.current && distanceRef.current >= TRIGGER_DISTANCE;
      pulling.current = false;
      if (shouldRefresh) {
        refresh();
        return;
      }
      setDistance(0);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });
    document.addEventListener("touchcancel", onTouchEnd, { passive: true });

    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [enabled, refresh, setDistance]);

  return {
    pullDistance,
    refreshing,
    armed: pullDistance >= TRIGGER_DISTANCE,
    visible: pullDistance > 8 || refreshing,
  };
}
