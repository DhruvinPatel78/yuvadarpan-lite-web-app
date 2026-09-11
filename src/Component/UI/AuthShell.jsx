import React from "react";
import Card from "./Card";
import { YuvadarpanLogo } from "../Icons";

export default function AuthShell({
  children,
  maxWidthClass = "sm:max-w-[420px]",
  showBrand = true,
  cardClassName = "",
}) {
  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center px-3 py-6 md:px-4 md:py-10 relative overflow-hidden"
      style={{
        backgroundColor: "#f4f0ea",
        backgroundImage: [
          "radial-gradient(ellipse 90% 55% at 50% -18%, rgba(84,43,43,0.14), transparent 58%)",
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cpath d='M28 6 L38 28 L28 50 L18 28 Z' fill='none' stroke='%23542b2b' stroke-width='0.7' opacity='0.07'/%3E%3C/svg%3E\")",
        ].join(", "),
      }}
    >
      {showBrand ? (
        <div className="mb-5 md:mb-6 flex flex-col items-center px-2">
          <YuvadarpanLogo
            fill="#542b2b"
            maxHeight={40}
            className="app-auth-logo !w-auto"
            style={{ width: "auto", maxWidth: 280 }}
            ariaLabel="Yuvadarpan"
          />
        </div>
      ) : null}
      <Card
        padded={false}
        className={`w-full ${maxWidthClass} ${cardClassName} shadow-raised !border-0`}
      >
        <div className="p-4 sm:p-8">{children}</div>
      </Card>
      <p className="mt-8 text-center text-xs text-mutedText font-WorkRegular">
        © {new Date().getFullYear()} Yuvadarpan
      </p>
    </div>
  );
}
