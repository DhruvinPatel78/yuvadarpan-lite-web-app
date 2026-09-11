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
      className="min-h-screen flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden"
      style={{
        backgroundColor: "#f4f0ea",
        backgroundImage: [
          "radial-gradient(ellipse 90% 55% at 50% -18%, rgba(84,43,43,0.14), transparent 58%)",
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Cpath d='M28 6 L38 28 L28 50 L18 28 Z' fill='none' stroke='%23542b2b' stroke-width='0.7' opacity='0.07'/%3E%3C/svg%3E\")",
        ].join(", "),
      }}
    >
      {showBrand ? (
        <div className="mb-6 flex flex-col items-center">
          <YuvadarpanLogo
            fill="#542b2b"
            maxHeight={40}
            className="!w-auto"
            style={{ width: "auto", maxWidth: 280 }}
            ariaLabel="Yuvadarpan"
          />
        </div>
      ) : null}
      <Card
        padded={false}
        className={`w-full max-w-[90%] ${maxWidthClass} ${cardClassName} shadow-raised !border-0`}
      >
        <div className="p-6 sm:p-8">{children}</div>
      </Card>
      <p className="mt-8 text-center text-xs text-mutedText font-WorkRegular">
        © {new Date().getFullYear()} Yuvadarpan
      </p>
    </div>
  );
}
