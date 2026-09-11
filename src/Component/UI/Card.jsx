import React from "react";

export default function Card({
  children,
  className = "",
  padded = true,
  header = null,
  ...rest
}) {
  return (
    <div
      className={`bg-white rounded-xl border border-line shadow-card overflow-hidden ${className}`}
      {...rest}
    >
      {header}
      {padded ? <div className="p-5 sm:p-6">{children}</div> : children}
    </div>
  );
}
