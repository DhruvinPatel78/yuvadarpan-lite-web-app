import React, { useState } from "react";
import InstallMobileIcon from "@mui/icons-material/InstallMobile";
import IosShareIcon from "@mui/icons-material/IosShare";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import usePwaInstall from "../../pwa/usePwaInstall";
import { Button, Card, FormModal } from "../UI";

function IosInstallSteps() {
  return (
    <ol className="text-sm text-mutedText space-y-2.5 list-decimal pl-5">
      <li>
        Tap the{" "}
        <span className="inline-flex items-center gap-1 font-semibold text-primary">
          Share <IosShareIcon sx={{ fontSize: 16 }} />
        </span>{" "}
        button in Safari.
      </li>
      <li>
        Scroll and tap{" "}
        <span className="font-semibold text-primary">Add to Home Screen</span>.
      </li>
      <li>
        Tap <span className="font-semibold text-primary">Add</span> to install
        Yuvadarpan.
      </li>
    </ol>
  );
}

export function PwaInstallCard() {
  const { canInstall, showIosHelp, isInstalled, promptInstall } =
    usePwaInstall();
  const [iosOpen, setIosOpen] = useState(false);

  if (isInstalled) {
    return (
      <Card className="w-full">
        <div className="flex items-start gap-3">
          <CheckCircleOutlineIcon className="text-primary mt-0.5" />
          <div>
            <h2 className="text-base font-semibold text-primary">
              Installed as an app
            </h2>
            <p className="text-sm text-mutedText mt-1">
              Yuvadarpan is already installed on this device.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (!canInstall && !showIosHelp) {
    return (
      <Card className="w-full">
        <h2 className="text-base font-semibold text-primary">Install app</h2>
        <p className="text-sm text-mutedText mt-1">
          Use your browser menu to install Yuvadarpan, or open this site in
          Chrome or Safari on your phone.
        </p>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <h2 className="text-base font-semibold text-primary">Install app</h2>
        <p className="text-sm text-mutedText mt-1 mb-5">
          Add Yuvadarpan to your home screen for quicker access, like a native
          app.
        </p>
        <div className="flex justify-end max-md:[&>button]:w-full">
          <Button
            type="button"
            icon={<InstallMobileIcon sx={{ fontSize: 18 }} />}
            onClick={async () => {
              if (showIosHelp && !canInstall) {
                setIosOpen(true);
                return;
              }
              const outcome = await promptInstall();
              if (outcome === "unavailable" && showIosHelp) {
                setIosOpen(true);
              }
            }}
          >
            Install Yuvadarpan
          </Button>
        </div>
      </Card>
      <FormModal
        open={iosOpen}
        onClose={() => setIosOpen(false)}
        title="Add to Home Screen"
      >
        <IosInstallSteps />
      </FormModal>
    </>
  );
}

export default function PwaInstallBanner() {
  const {
    canInstall,
    showIosHelp,
    isInstalled,
    dismissed,
    promptInstall,
    dismissBanner,
  } = usePwaInstall();
  const [iosOpen, setIosOpen] = useState(false);

  if (isInstalled || dismissed || (!canInstall && !showIosHelp)) {
    return null;
  }

  return (
    <>
      <div className="pwa-install-banner fixed inset-x-0 top-0 z-[1200] p-3">
        <div className="mx-auto max-w-lg bg-white border border-line shadow-raised rounded-xl p-4 flex items-start gap-3">
          <img
            src={`${process.env.PUBLIC_URL}/logo.svg`}
            alt=""
            className="shrink-0 w-10 h-10 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-WorkSemiBold text-primary">
              Install Yuvadarpan
            </p>
            <p className="text-xs text-mutedText mt-0.5 leading-relaxed">
              {showIosHelp && !canInstall
                ? "Add it to your Home Screen for a full-screen app experience."
                : "Install the app on your device for faster access."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                type="button"
                className="!h-9 !px-3"
                icon={<InstallMobileIcon sx={{ fontSize: 16 }} />}
                onClick={async () => {
                  if (showIosHelp && !canInstall) {
                    setIosOpen(true);
                    return;
                  }
                  const outcome = await promptInstall();
                  if (outcome === "unavailable" && showIosHelp) {
                    setIosOpen(true);
                  }
                }}
              >
                {showIosHelp && !canInstall ? "How to install" : "Install"}
              </Button>
              <Button
                type="button"
                variant="ghost"
                className="!h-9 !px-3"
                onClick={dismissBanner}
              >
                Not now
              </Button>
            </div>
          </div>
          <button
            type="button"
            aria-label="Dismiss install prompt"
            className="shrink-0 text-primary p-1 rounded-md hover:bg-muted min-w-[44px] min-h-[44px] md:min-w-0 md:min-h-0 flex items-center justify-center"
            onClick={dismissBanner}
          >
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>
      <FormModal
        open={iosOpen}
        onClose={() => setIosOpen(false)}
        title="Add to Home Screen"
      >
        <IosInstallSteps />
      </FormModal>
    </>
  );
}
