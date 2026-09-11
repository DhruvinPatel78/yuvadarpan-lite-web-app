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
      className={`w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5 ${className}`}
    >
      <div className="min-w-0 flex items-start gap-2">
        {leading ? <div className="shrink-0">{leading}</div> : null}
        <div className="min-w-0">
          {eyebrow ? (
            <p className="text-xs font-medium uppercase tracking-wide text-mutedText">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-xl md:text-2xl font-WorkSemiBold text-primary leading-tight flex items-start md:items-center gap-2.5">
            <span
              className="inline-block w-2 h-2 rotate-45 bg-primary shrink-0 mt-2 md:mt-0"
              aria-hidden
            />
            <span className="min-w-0 break-words">{title}</span>
          </h1>
          {description ? (
            <p className="text-sm text-mutedText mt-1 break-words">{description}</p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="min-w-0 w-full md:w-auto md:shrink-0 max-md:[&>button]:w-full max-md:[&>div]:w-full">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
