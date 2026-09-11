import React from "react";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LoadableImage from "./LoadableImage";

const ProfileCard = ({
  name,
  location,
  age,
  dob,
  imgSrc,
  father,
  mother,
  firm,
  surname,
  onClick,
}) => {
  const fullName = [name, mother, father, surname]
    .filter((part) => part && String(part).trim())
    .join(" ");
  const bornDate = dob ? String(dob).split(",")[0].trim() : "";

  return (
    <div
      className="group w-full min-w-0 h-full rounded-xl overflow-hidden bg-white border border-line shadow-card hover:border-primary transition-colors duration-200 cursor-pointer flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      <div className="aspect-[5/4] bg-muted overflow-hidden">
        <LoadableImage
          src={imgSrc}
          alt={fullName}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          spinnerSize={30}
        />
      </div>
      <div className="px-3.5 pt-3.5 pb-3.5 flex flex-col flex-1 min-w-0">
        <h2 className="text-[15px] font-semibold text-primary leading-snug line-clamp-2">
          {fullName}
        </h2>
        <p className="mt-2 text-sm text-mutedText flex items-start gap-1.5 min-w-0">
          <PlaceOutlinedIcon
            sx={{ fontSize: 16, color: "#8a8a96", marginTop: "2px" }}
          />
          <span className="truncate">
            {location || "—"}
            {age || age === 0 ? ` · ${age} yrs` : ""}
          </span>
        </p>
        <p className="mt-1.5 text-sm text-primary flex items-start gap-1.5 min-w-0">
          <WorkOutlineIcon
            sx={{ fontSize: 16, color: "#8a8a96", marginTop: "2px" }}
          />
          <span className="truncate">{firm || "—"}</span>
        </p>
        <div className="mt-auto pt-3 border-t border-line flex items-center justify-between gap-2">
          <span className="text-xs text-mutedText truncate">
            {bornDate ? `Born ${bornDate}` : ""}
          </span>
          <span className="text-sm font-semibold text-primary whitespace-nowrap">
            View
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
