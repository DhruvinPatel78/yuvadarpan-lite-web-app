import { useCallback, useEffect, useState } from "react";

const DISMISS_KEY = "yuvadarpan.pwaBannerDismissed";
const INSTALLED_KEY = "yuvadarpan.pwaInstalled";

const isIosDevice = () => {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const ua = navigator.userAgent || "";
  const iOS = /iphone|ipad|ipod/i.test(ua);
  const iPadOs =
    navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
  return iOS || iPadOs;
};

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

const getStoredFlag = (key) => {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
};

const setStoredFlag = (key) => {
  try {
    window.localStorage.setItem(key, "1");
  } catch {
    // ignore storage failures
  }
};

const clearStoredFlag = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore storage failures
  }
};

export default function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(isStandaloneDisplay);
  const [isIos, setIsIos] = useState(isIosDevice);
  const [dismissed, setDismissed] = useState(() => getStoredFlag(DISMISS_KEY));

  useEffect(() => {
    setIsIos(isIosDevice());

    const rememberInstalled = () => {
      setStoredFlag(INSTALLED_KEY);
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    const rememberUninstalled = () => {
      const wasInstalled = getStoredFlag(INSTALLED_KEY);
      clearStoredFlag(INSTALLED_KEY);
      setIsInstalled(false);
      if (wasInstalled) {
        clearStoredFlag(DISMISS_KEY);
        setDismissed(false);
      }
    };

    const refreshInstallState = async () => {
      if (isStandaloneDisplay()) {
        rememberInstalled();
        return;
      }

      if (typeof navigator.getInstalledRelatedApps === "function") {
        try {
          const apps = await navigator.getInstalledRelatedApps();
          if (apps?.length) {
            rememberInstalled();
            return;
          }
        } catch {
          // ignore unsupported or failed checks
        }
      }

      if (getStoredFlag(INSTALLED_KEY) && !isStandaloneDisplay()) {
        rememberUninstalled();
      }
    };

    refreshInstallState();

    const mediaQueries = [
      window.matchMedia("(display-mode: standalone)"),
      window.matchMedia("(display-mode: fullscreen)"),
      window.matchMedia("(display-mode: minimal-ui)"),
      window.matchMedia("(display-mode: window-controls-overlay)"),
    ];
    const onMedia = () => {
      if (isStandaloneDisplay()) {
        rememberInstalled();
      } else {
        refreshInstallState();
      }
    };
    mediaQueries.forEach((media) => media.addEventListener?.("change", onMedia));

    const onBeforeInstall = (event) => {
      event.preventDefault();
      if (isStandaloneDisplay()) {
        rememberInstalled();
        return;
      }
      // Chrome only fires this when the app can be installed again.
      rememberUninstalled();
      setDeferredPrompt(event);
    };
    const onInstalled = () => {
      rememberInstalled();
    };
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refreshInstallState();
      }
    };

    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    window.addEventListener("appinstalled", onInstalled);
    window.addEventListener("pageshow", refreshInstallState);
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      mediaQueries.forEach((media) =>
        media.removeEventListener?.("change", onMedia),
      );
      window.removeEventListener("beforeinstallprompt", onBeforeInstall);
      window.removeEventListener("appinstalled", onInstalled);
      window.removeEventListener("pageshow", refreshInstallState);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return "unavailable";
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
    if (outcome === "accepted") {
      setStoredFlag(INSTALLED_KEY);
      setIsInstalled(true);
    }
    return outcome;
  }, [deferredPrompt]);

  const dismissBanner = useCallback(() => {
    setDismissed(true);
    setStoredFlag(DISMISS_KEY);
  }, []);

  const canInstall = Boolean(deferredPrompt) && !isInstalled;
  const showIosHelp = isIos && !isInstalled;

  return {
    canInstall,
    showIosHelp,
    isInstalled,
    isStandalone: isInstalled,
    isIos,
    dismissed,
    promptInstall,
    dismissBanner,
  };
}
