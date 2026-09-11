import React from "react";

export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  leading,
  className = "",
}) {
  return (
    <div
      className={`w-full flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 ${className}`}
    >
      <div className="min-w-0 flex items-start gap-2">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-wide text-mutedText">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-xl sm:text-2xl font-WorkSemiBold text-primary leading-tight flex items-center gap-2.5">
            <span
              className="inline-block w-2 h-2 rotate-45 bg-primary shrink-0"
              aria-hidden
            />
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-mutedText mt-1">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}
