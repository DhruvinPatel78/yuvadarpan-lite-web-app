import React from "react";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import LoadableImage from "./LoadableImage";
import { asDisplayText } from "../../util/bhasha";

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
  shortlisted = false,
  onToggleShortlist,
}) => {
  const fullName = [name, mother, father, surname]
    .map((part) => asDisplayText(part))
    .filter(Boolean)
    .join(" ");
  const bornDate = dob ? String(dob).split(",")[0].trim() : "";
  const locationText = asDisplayText(location);
  const firmText = asDisplayText(firm);
  const ageNum = Number(age);
  const ageText =
    Number.isFinite(ageNum) && ageNum >= 0 && ageNum <= 120
      ? `${ageNum} yrs`
      : "";

  return (
    <div
      className="group w-full min-w-0 h-full rounded-xl overflow-hidden bg-white border-2 border-solid border-line-strong md:border md:border-line shadow-card hover:border-primary transition-colors duration-200 cursor-pointer flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
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
      <div className="aspect-[5/4] bg-muted overflow-hidden relative">
        <LoadableImage
          src={imgSrc}
          alt={fullName}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          spinnerSize={30}
        />
        {onToggleShortlist ? (
          <button
            type="button"
            aria-label={shortlisted ? "Remove from shortlist" : "Add to shortlist"}
            aria-pressed={shortlisted}
            className="absolute top-2 right-2 z-10 w-11 h-11 rounded-full bg-white/95 text-primary border border-line shadow-card flex items-center justify-center"
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onToggleShortlist();
            }}
          >
            {shortlisted ? (
              <BookmarkIcon fontSize="small" />
            ) : (
              <BookmarkBorderIcon fontSize="small" />
            )}
          </button>
        ) : null}
      </div>
      <div className="px-3.5 pt-3.5 pb-3.5 flex flex-col flex-1 min-w-0">
        <h2 className="text-[15px] font-semibold text-primary leading-snug line-clamp-2">
          {fullName || "—"}
        </h2>
        <p className="mt-2 text-sm text-mutedText flex items-start gap-1.5 min-w-0">
          <PlaceOutlinedIcon
            sx={{ fontSize: 16, color: "#8a8a96", marginTop: "2px" }}
          />
          <span className="truncate">
            {locationText || "—"}
            {ageText ? ` · ${ageText}` : ""}
          </span>
        </p>
        <p className="mt-1.5 text-sm text-primary flex items-start gap-1.5 min-w-0">
          <WorkOutlineIcon
            sx={{ fontSize: 16, color: "#8a8a96", marginTop: "2px" }}
          />
          <span className="truncate">{firmText || "—"}</span>
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
