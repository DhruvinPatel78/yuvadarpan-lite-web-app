import React from "react";
import Card from "../UI/Card";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const CustomCard = ({ title, action }) => {
  return (
    <Card
      className="group w-full cursor-pointer hover:border-primary transition-colors duration-200"
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
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-semibold text-primary">{title}</h2>
        <ChevronRightIcon
          className="text-mutedText group-hover:text-primary shrink-0"
          fontSize="small"
        />
      </div>
    </Card>
  );
};

export default CustomCard;
