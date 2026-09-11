import React from "react";
import Card from "../UI/Card";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CustomCard = ({ title, action }) => {
  const initial = String(title || "")
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <Card
      padded={false}
      className="group w-full cursor-pointer hover:border-primary hover:shadow-raised transition-all duration-200"
      onClick={action}
      role="button"
      tabIndex={0}
      aria-label={`Navigate to ${title}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          action?.();
        }
      }}
    >
      <div className="flex items-center justify-between gap-3 md:gap-4 min-h-[96px] md:min-h-[108px] px-4 py-4 md:px-5 md:py-5">
        <div className="flex items-center gap-3.5 min-w-0">
          <span
            className="w-12 h-12 rounded-xl bg-muted text-primary font-WorkSemiBold text-lg flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors"
            aria-hidden
          >
            {initial}
          </span>
          <h2 className="text-base font-WorkSemiBold text-primary leading-snug break-words">
            {title}
          </h2>
        </div>
        <span className="w-9 h-9 rounded-full bg-muted text-mutedText flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
          <ChevronRightIcon fontSize="small" />
        </span>
      </div>
    </Card>
  );
};

export default CustomCard;
