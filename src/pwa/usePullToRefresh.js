import { useCallback, useEffect, useRef, useState } from "react";

const TRIGGER_DISTANCE = 64;
const MAX_PULL = 120;
const RESISTANCE = 0.55;
const INSTALLED_KEY = "yuvadarpan.pwaInstalled";

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

const isPwaContext = () => {
  if (isStandaloneDisplay()) return true;
  try {
    return window.localStorage.getItem(INSTALLED_KEY) === "1";
  } catch {
    return false;
  }
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

const isVisibleOverlay = (node) => {
  if (!(node instanceof Element)) return false;
  if (node.getAttribute("aria-hidden") === "true") return false;
  if (node.hasAttribute("hidden")) return false;
  const style = window.getComputedStyle(node);
  if (
    style.display === "none" ||
    style.visibility === "hidden" ||
    Number(style.opacity) === 0
  ) {
    return false;
  }
  // keepMounted MUI Menus leave an empty Modal shell in the DOM when closed
  const rect = node.getBoundingClientRect();
  if (rect.width < 2 && rect.height < 2) return false;
  return true;
};

const hasOpenOverlay = () => {
  const nodes = document.querySelectorAll(
    ".MuiModal-root, .MuiDrawer-root, .MuiDialog-root, [aria-modal='true']"
  );
  return Array.from(nodes).some(isVisibleOverlay);
};

export default function usePullToRefresh({
  enabled = true,
  onRefresh,
} = {}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [active, setActive] = useState(() =>
    typeof window !== "undefined" ? isPwaContext() : false
  );
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
      refreshingRef.current = false;
      setRefreshing(false);
      setDistance(0);
    }
  }, [onRefresh, setDistance]);

  useEffect(() => {
    const syncActive = () => setActive(isPwaContext());
    syncActive();
    const media = window.matchMedia("(display-mode: standalone)");
    if (media.addEventListener) {
      media.addEventListener("change", syncActive);
      return () => media.removeEventListener("change", syncActive);
    }
    media.addListener(syncActive);
    return () => media.removeListener(syncActive);
  }, []);

  useEffect(() => {
    if (!enabled || !active) {
      return undefined;
    }

    const resetPull = () => {
      tracking.current = false;
      pulling.current = false;
      setDistance(0);
    };

    const onTouchStart = (event) => {
      if (refreshingRef.current || hasOpenOverlay()) {
        resetPull();
        return;
      }
      if (pageScrollTop() > 1) {
        resetPull();
        return;
      }
      if (scrolledAncestorBlocksPull(event.target)) {
        resetPull();
        return;
      }
      startY.current = event.touches[0].clientY;
      tracking.current = true;
      pulling.current = false;
    };

    const onTouchMove = (event) => {
      if (!tracking.current || refreshingRef.current) return;
      if (pageScrollTop() > 1) {
        resetPull();
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
  }, [active, enabled, refresh, setDistance]);

  return {
    pullDistance,
    refreshing,
    armed: pullDistance >= TRIGGER_DISTANCE,
    visible: pullDistance > 6 || refreshing,
    active,
  };
}
