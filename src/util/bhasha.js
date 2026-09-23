import { BhaSha } from "@bhashaime/core";
import { tForm } from "../i18n/yuvaForm";

const bhaSha = new BhaSha();
bhaSha.setLanguage("gujarati");

export const transliterateToGujarati = (text) => {
  const value = String(text ?? "");
  if (!value.trim()) {
    return "";
  }
  try {
    return bhaSha.transliterateText(value) || "";
  } catch (e) {
    return "";
  }
};

export const emptyYuvaGu = () => ({
  firstName: "",
  fatherName: "",
  grandFatherName: "",
  motherName: "",
  pob: "",
  firm: "",
  firmAddress: "",
  address: "",
  mamaInfo: {
    name: "",
    city: "",
    lastName: "",
    native: "",
  },
  contactInfo: {
    name: "",
    lastName: "",
  },
  lastName: "",
  native: "",
  country: "",
  state: "",
  region: "",
  district: "",
  city: "",
  localSamaj: "",
  handicapDetails: "",
  other: {},
});

const GU_TEXT_PATHS = [
  "firstName",
  "fatherName",
  "grandFatherName",
  "motherName",
  "pob",
  "firm",
  "firmAddress",
  "address",
  "mamaInfo.name",
  "mamaInfo.city",
  "contactInfo.name",
  "handicapDetails",
];

const CHOICE_FIELDS = [
  ["gender", (code) => code],
  ["martialStatus", (code) => `marital.${code}`],
  ["activity", (code) => `activity.${code}`],
];

const getByPath = (obj, path) =>
  String(path || "")
    .split(".")
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

const setByPath = (obj, path, value) => {
  const keys = String(path || "").split(".");
  let cursor = obj;
  keys.forEach((key, index) => {
    if (index === keys.length - 1) {
      cursor[key] = value;
      return;
    }
    if (!cursor[key] || typeof cursor[key] !== "object") {
      cursor[key] = {};
    }
    cursor = cursor[key];
  });
};

export const mergeYuvaGu = (sourceGu = {}) => {
  const base = emptyYuvaGu();
  return {
    ...base,
    ...(sourceGu || {}),
    mamaInfo: {
      ...base.mamaInfo,
      ...(sourceGu?.mamaInfo || {}),
    },
    contactInfo: {
      ...base.contactInfo,
      ...(sourceGu?.contactInfo || {}),
    },
    other: sourceGu?.other || {},
  };
};

const asLangPair = (value, fallbackEn = "", fallbackGu = "") => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return {
      en: String(value.en || fallbackEn || "").trim(),
      gu: String(value.gu || fallbackGu || "").trim(),
    };
  }
  return {
    en: String(fallbackEn || value || "").trim(),
    gu: String(fallbackGu || "").trim(),
  };
};

const asInputText = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return String(value.en || value.gu || "").trim();
  }
  return String(value ?? "").trim();
};

const choiceCode = (value) => asInputText(value).toLowerCase();

const toChoicePair = (value, toKey) => {
  const code = choiceCode(value);
  if (!code) return { en: "", gu: "" };
  const key = toKey(code);
  return {
    en: tForm("en", key) || code,
    gu: tForm("gu", key) || code,
  };
};

export const fillMissingGujarati = (values = {}) => {
  const gu = mergeYuvaGu(values.gu);
  GU_TEXT_PATHS.forEach((path) => {
    const keys = path.split(".");
    const storedGu =
      keys.length === 1
        ? values[`${path}Gu`]
        : getByPath(values, `${keys[0]}.${keys[1]}Gu`);
    const storedGuText = asInputText(storedGu);
    if (storedGuText && !asInputText(getByPath(gu, path))) {
      setByPath(gu, path, storedGuText);
    }
    const english = asInputText(getByPath(values, path));
    const current = asInputText(getByPath(gu, path));
    if (english && !current) {
      setByPath(gu, path, transliterateToGujarati(english));
    }
  });
  const otherSource =
    values.other &&
    typeof values.other === "object" &&
    !Array.isArray(values.other) &&
    (typeof values.other.en === "object" || typeof values.other.gu === "object")
      ? values.other.en || {}
      : values.other;
  if (otherSource && typeof otherSource === "object" && !Array.isArray(otherSource)) {
    const otherGu = { ...(gu.other || {}) };
    Object.entries(otherSource).forEach(([key, value]) => {
      if (typeof value === "object") return;
      if (String(value || "").trim() && !String(otherGu[key] || "").trim()) {
        otherGu[key] = transliterateToGujarati(value);
      }
    });
    gu.other = otherGu;
  }
  return gu;
};

export const flattenYuvaForm = (record = {}) => {
  const next = { ...record };
  GU_TEXT_PATHS.forEach((path) => {
    const keys = path.split(".");
    if (keys.length === 1) {
      const pair = asLangPair(next[path], next[`${path}En`], next[`${path}Gu`]);
      next[path] = pair.en;
      next[`${path}Gu`] = pair.gu;
      delete next[`${path}En`];
      return;
    }
    const parentKey = keys[0];
    const child = keys[1];
    const parent = { ...(next[parentKey] || {}) };
    const pair = asLangPair(parent[child], parent[`${child}En`], parent[`${child}Gu`]);
    parent[child] = pair.en;
    parent[`${child}Gu`] = pair.gu;
    delete parent[`${child}En`];
    next[parentKey] = parent;
  });
  const other = next.other;
  if (
    other &&
    typeof other === "object" &&
    !Array.isArray(other) &&
    (typeof other.en === "object" || typeof other.gu === "object")
  ) {
    next.otherGu = other.gu || next.otherGu || {};
    next.other = other.en || {};
  } else {
    next.other = next.otherEn || other || {};
    next.otherGu = next.otherGu || {};
  }
  delete next.otherEn;
  delete next.gu;
  CHOICE_FIELDS.forEach(([key]) => {
    next[key] = choiceCode(next[key]);
    delete next[`${key}En`];
    delete next[`${key}Gu`];
  });
  return next;
};

export const toEnGuPayload = (values = {}, extra = {}) => {
  const withOther = {
    ...values,
    other: extra.other !== undefined ? extra.other : values.other,
  };
  const { gu: _gu, profile, profileName, email, ...payload } = withOther;
  const gu = fillMissingGujarati(withOther);
  if (extra.otherGu) {
    gu.other = extra.otherGu;
  }
  GU_TEXT_PATHS.forEach((path) => {
    const en = asInputText(getByPath(withOther, path));
    const guVal = asInputText(getByPath(gu, path));
    const keys = path.split(".");
    if (keys.length === 1) {
      payload[keys[0]] = { en: en || "", gu: guVal || "" };
      delete payload[`${keys[0]}En`];
      delete payload[`${keys[0]}Gu`];
    } else {
      const parent = keys[0];
      const child = keys[1];
      payload[parent] = { ...(payload[parent] || {}) };
      payload[parent][child] = { en: en || "", gu: guVal || "" };
      delete payload[parent][`${child}En`];
      delete payload[parent][`${child}Gu`];
    }
  });
  payload.other = {
    en:
      extra.other !== undefined
        ? extra.other || {}
        : payload.other && typeof payload.other === "object" && payload.other.en
          ? payload.other.en
          : payload.other || {},
    gu: extra.otherGu || gu.other || {},
  };
  delete payload.otherEn;
  delete payload.otherGu;
  delete payload.gu;
  CHOICE_FIELDS.forEach(([key, toKey]) => {
    payload[key] = toChoicePair(withOther[key], toKey);
    delete payload[`${key}En`];
    delete payload[`${key}Gu`];
  });
  return payload;
};

export const languageLabel = (code) =>
  String(code || "").toLowerCase() === "gu" ? "Gujarati" : "English";

export const userLanguage = (user) =>
  String(user?.language || "").toLowerCase() === "en" ? "en" : "gu";

export const langText = (value, lang = "en") => {
  if (value == null || value === "") return "";
  if (typeof value === "object" && !Array.isArray(value)) {
    if (value.name && typeof value.name === "object") {
      return langText(value.name, lang);
    }
    const en = String(value.en ?? value.nameEn ?? "").trim();
    const gu = String(value.gu ?? value.nameGu ?? "").trim();
    if (en || gu) {
      return String(lang).toLowerCase() === "gu" && gu ? gu : en || gu;
    }
    if (typeof value.name === "string") {
      return value.name;
    }
    return "";
  }
  return String(value).trim();
};

export const asDisplayText = langText;

export const isFilledValue = (...parts) =>
  parts.some((value) => {
    if (value == null || value === false) {
      return false;
    }
    if (typeof value === "number") {
      return Number.isFinite(value);
    }
    if (typeof value === "object") {
      if (Array.isArray(value)) {
        return value.some((item) => isFilledValue(item));
      }
      if (typeof value.isValid === "function") {
        return Boolean(value.isValid());
      }
      if (value instanceof Date) {
        return !Number.isNaN(value.getTime());
      }
      return isFilledValue(
        value.en,
        value.gu,
        value.id,
        value.value,
        value.uuid,
        value._id,
        value.name
      );
    }
    return String(value).trim() !== "";
  });

export const pickLangValue = (en, gu, lang) => {
  if (en && typeof en === "object") {
    return langText(en, lang);
  }
  const guText = typeof gu === "object" ? langText(gu, lang) : gu;
  return String(lang || "").toLowerCase() === "gu" && String(guText || "").trim()
    ? guText
    : langText(en, lang);
};

export const pickYuvaLangText = (data, field, lang) => {
  const nested = getByPath(data, field);
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    return langText(nested, lang);
  }
  return pickLangValue(
    getByPath(data, `${field}En`) || nested,
    getByPath(data, `${field}Gu`),
    lang
  );
};

export const pickOtherMap = (data, lang = "en") => {
  const other = data?.other;
  if (
    other &&
    typeof other === "object" &&
    !Array.isArray(other) &&
    (typeof other.en === "object" || typeof other.gu === "object")
  ) {
    return String(lang).toLowerCase() === "gu"
      ? other.gu || other.en || {}
      : other.en || {};
  }
  return String(lang).toLowerCase() === "gu"
    ? data?.otherGu || other || {}
    : data?.otherEn || other || {};
};

export const masterNameText = (row, lang = "en") => {
  if (row == null) return "";
  if (typeof row === "string" || typeof row === "number") {
    return String(row).trim();
  }
  return (
    langText(row.name, lang) ||
    langText(row, lang) ||
    String(row.nameEn || row.label || "").trim()
  );
};

const foldText = (value) =>
  String(value || "")
    .normalize("NFKC")
    .toLocaleLowerCase();

export const matchesLangQuery = (option, query) => {
  const q = foldText(query).trim();
  if (!q) return true;
  return (
    foldText(masterNameText(option, "en")).includes(q) ||
    foldText(masterNameText(option, "gu")).includes(q) ||
    foldText(option?.label).includes(q) ||
    foldText(option?.value).includes(q) ||
    foldText(option?.id).includes(q)
  );
};

export const fillMasterName = (setFieldValue, row = {}) => {
  const name = row?.name;
  const en =
    name && typeof name === "object"
      ? name.en || ""
      : row?.nameEn || row?.name || "";
  const gu =
    name && typeof name === "object" ? name.gu || "" : row?.nameGu || "";
  setFieldValue("name", String(en || "").trim());
  setFieldValue("nameGu", String(gu || "").trim());
};

export const toNameEnGuPayload = (values = {}) => {
  const { nameEn, nameGu, confirmPassword, ...rest } = values;
  const en = String(
    nameEn ||
      (rest.name && typeof rest.name === "object" ? rest.name.en : rest.name) ||
      ""
  ).trim();
  const gu =
    String(
      nameGu ||
        (rest.name && typeof rest.name === "object" ? rest.name.gu : "") ||
        ""
    ).trim() || (en ? transliterateToGujarati(en) : "");
  return {
    ...rest,
    name: { en, gu },
  };
};

