import React, { useCallback, useEffect, useRef } from "react";
import { FormikContext } from "formik";
import { useDirectInputTransliteration } from "@bhashaime/core";
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

function GujaratiImeField({
  inputRef,
  initialRawValue,
  onTransliterate,
  ...inputProps
}) {
  const frozenRaw = useRef(initialRawValue || "").current;
  const onTransliterateRef = useRef(onTransliterate);
  onTransliterateRef.current = onTransliterate;
  const stableOnTransliterate = useCallback((raw, transliterated) => {
    onTransliterateRef.current?.(raw, transliterated);
  }, []);

  useDirectInputTransliteration({
    ref: inputRef,
    language: "gujarati",
    initialRawValue: frozenRaw,
    onTransliterate: stableOnTransliterate,
  });

  return <CustomInput {...inputProps} inputRef={inputRef} />;
}

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
  const inputRef = useRef(null);
  const isGu = language === FORM_LANG.GU;
  const guName = toGuName(enName);
  const useStandalone = standalone || !formik;

  const enValueRaw = useStandalone
    ? enValueProp || ""
    : getByPath(formik?.values, enName) || "";
  const guValueRaw = useStandalone
    ? guValueProp || ""
    : getByPath(formik?.values, guName) || "";
  const asText = (value) => {
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return String(value.en || value.gu || "");
    }
    return value || "";
  };
  const enValue = asText(enValueRaw);
  const guValue = asText(guValueRaw);
  const autoGu = String(enValue || "").trim()
    ? transliterateToGujarati(enValue)
    : "";
  const keepSavedGu = Boolean(String(guValue || "").trim()) && guValue !== autoGu;
  const guFieldKind = useRef({ language: "", plain: false });
  if (guFieldKind.current.language !== language) {
    const hasGu = Boolean(String(guValue || "").trim());
    const hasEn = Boolean(String(enValue || "").trim());
    guFieldKind.current = {
      language,
      plain: isGu && hasGu && (!hasEn || keepSavedGu),
    };
  }

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

  useEffect(() => {
    if (!isGu && String(enValue || "").trim() && !String(guValue || "").trim()) {
      persist(enValue, transliterateToGujarati(enValue));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGu]);

  const handleEnglishChange = (event) => {
    const next = event.target.value;
    persist(next, keepSavedGu ? guValue : transliterateToGujarati(next));
  };

  const common = {
    ...inputProps,
    name: enName,
    onBlur: onBlur || formik?.handleBlur,
  };

  if (isGu) {
    if (guFieldKind.current.plain) {
      return (
        <CustomInput
          key={`${enName}-gu-saved`}
          {...common}
          value={guValue}
          onChange={(event) => persist(enValue, event.target.value)}
        />
      );
    }
    return (
      <GujaratiImeField
        key={`${enName}-gu`}
        inputRef={inputRef}
        initialRawValue={enValue}
        onTransliterate={(raw, transliterated) => {
          if (!raw && !transliterated && (enValue || guValue)) {
            return;
          }
          persist(enValue, transliterated);
        }}
        {...common}
        uncontrolled
        value={guValue}
        onChange={() => {}}
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
