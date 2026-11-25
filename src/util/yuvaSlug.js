import slugify from "slugify";
import { transliterate } from "transliteration";
import { langText, masterNameText } from "./bhasha";

const MAX_BASE = 80;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RESERVED = new Set([
  "admin",
  "login",
  "settings",
  "api",
  "register",
  "profile",
  "yuva",
]);

const asPart = (value) => {
  if (value == null || value === "") return "";
  if (typeof value === "object") {
    return langText(value, "en") || langText(value, "gu") || "";
  }
  return String(value).trim();
};

export const buildYuvaSlugPreview = ({
  firstName,
  fatherName,
  grandFatherName,
  lastName,
  surnameList = [],
} = {}) => {
  let surname = "";
  if (lastName) {
    const found = (Array.isArray(surnameList) ? surnameList : []).find(
      (item) =>
        String(item?.id || item?.value || item?._id || "") === String(lastName)
    );
    surname =
      masterNameText(found, "en") ||
      masterNameText(found, "gu") ||
      asPart(found?.label) ||
      "";
  }
  const joined = [firstName, fatherName, grandFatherName, surname]
    .map(asPart)
    .filter(Boolean)
    .map((part) => transliterate(part))
    .join(" ");
  let base = slugify(joined, { lower: true, strict: true });
  if (base.length > MAX_BASE) {
    base = base.slice(0, MAX_BASE).replace(/-+$/g, "");
  }
  if (!base) return "";
  if (RESERVED.has(base)) return `u-${base}`;
  return base;
};

export const validateYuvaSlugFormat = (value) => {
  const slug = String(value || "").trim().toLowerCase();
  if (!slug) return "Required";
  if (slug.length > MAX_BASE) return "Max 80 characters";
  if (slug.startsWith("-") || slug.endsWith("-")) {
    return "No leading or trailing hyphen";
  }
  if (!SLUG_PATTERN.test(slug)) {
    return "Use lowercase letters, numbers, and hyphens only";
  }
  if (RESERVED.has(slug)) return "This slug is reserved";
  return "";
};

export const normalizeYuvaSlugInput = (value) => {
  const transliterated = transliterate(String(value || "").trim().toLowerCase());
  let slug = slugify(transliterated, { lower: true, strict: true });
  if (slug.length > MAX_BASE) {
    slug = slug.slice(0, MAX_BASE).replace(/-+$/g, "");
  }
  return slug;
};
