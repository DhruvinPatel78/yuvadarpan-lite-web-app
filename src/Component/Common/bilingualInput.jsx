import React, { useEffect, useRef } from "react";
import { FormikContext } from "formik";
import CustomInput from "./customInput";
import { transliterateToGujarati } from "../../util/bhasha";
import { useFormLanguage } from "../../context/FormLanguageContext";
import { FORM_LANG } from "../../i18n/yuvaForm";

const getByPath = (obj, path) =>
  String(path || "")
    .split(".")
    .reduce((acc, key) => (acc == null ? acc : acc[key]), obj);

const toGuName = (enName) => {
  const parts = String(enName || "").split(".");
  const last = parts.pop();
  return [...parts, `${last}Gu`].join(".");
};

const asText = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return String(value.en || value.gu || "");
  }
  return value == null ? "" : String(value);
};

export default function BilingualInput({
  enName,
  standalone = false,
  enValue: enValueProp,
  guValue: guValueProp,
  onValuesChange,
  onBlur,
  ...inputProps
}) {
  const { language } = useFormLanguage();
  const formik = React.useContext(FormikContext);
  const isGu = language === FORM_LANG.GU;
  const guName = toGuName(enName);
  const useStandalone = standalone || !formik;

  const enValueRaw = useStandalone
    ? enValueProp || ""
    : getByPath(formik?.values, enName) || "";
  const guValueRaw = useStandalone
    ? guValueProp || ""
    : getByPath(formik?.values, guName) || "";
  const enValue = asText(enValueRaw);
  const guValue = asText(guValueRaw);

  // Gu produced from the last English change. If current Gu still matches this,
  // later English edits may refresh Gu. Manual Gu edits clear this link.
  const lastAutoGuRef = useRef("");
  const guLinkedToEnRef = useRef(true);
  const bootstrappedRef = useRef(false);

  useEffect(() => {
    if (bootstrappedRef.current) {
      return;
    }
    bootstrappedRef.current = true;
    const auto = String(enValue || "").trim()
      ? transliterateToGujarati(enValue)
      : "";
    lastAutoGuRef.current = auto;
    // Existing Gu that differs from English transliteration was typed/saved by user.
    guLinkedToEnRef.current =
      !String(guValue || "").trim() || guValue === auto;
  }, [enValue, guValue]);

  const persist = (en, gu) => {
    if (en === enValue && gu === guValue) {
      return;
    }
    if (useStandalone) {
      onValuesChange?.({ en, gu });
      return;
    }
    formik.setFieldValue(enName, en);
    formik.setFieldValue(guName, gu);
  };

  const handleEnglishChange = (event) => {
    const next = event.target.value;
    if (guLinkedToEnRef.current) {
      const nextGu = String(next || "").trim()
        ? transliterateToGujarati(next)
        : "";
      lastAutoGuRef.current = nextGu;
      persist(next, nextGu);
      return;
    }
    persist(next, guValue);
  };

  const handleGujaratiChange = (event) => {
    const nextGu = event.target.value;
    guLinkedToEnRef.current = false;
    lastAutoGuRef.current = "";
    persist(enValue, nextGu);
  };

  // When switching to English with Gu still empty and still linked, fill Gu once.
  useEffect(() => {
    if (isGu) {
      return;
    }
    if (!guLinkedToEnRef.current) {
      return;
    }
    if (!String(enValue || "").trim() || String(guValue || "").trim()) {
      return;
    }
    const nextGu = transliterateToGujarati(enValue);
    lastAutoGuRef.current = nextGu;
    persist(enValue, nextGu);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGu]);

  const filled = Boolean(
    String(enValue || "").trim() || String(guValue || "").trim()
  );
  const common = {
    ...inputProps,
    name: enName,
    errors: filled ? "" : inputProps.errors,
    onBlur: onBlur || formik?.handleBlur,
  };

  if (isGu) {
    return (
      <CustomInput
        key={`${enName}-gu`}
        {...common}
        value={guValue}
        onChange={handleGujaratiChange}
      />
    );
  }

  return (
    <CustomInput
      key={`${enName}-en`}
      {...common}
      value={enValue}
      onChange={handleEnglishChange}
    />
  );
}
