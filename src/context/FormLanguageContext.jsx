import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { FORM_LANG, tForm } from "../i18n/yuvaForm";

const FormLanguageContext = createContext({
  language: FORM_LANG.EN,
  setLanguage: () => {},
  isGu: false,
  t: (key) => tForm(FORM_LANG.EN, key),
});

export function FormLanguageProvider({
  children,
  defaultLanguage = FORM_LANG.EN,
  syncFrom,
}) {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    if (syncFrom === FORM_LANG.EN || syncFrom === FORM_LANG.GU) {
      setLanguage(syncFrom);
    }
  }, [syncFrom]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isGu: language === FORM_LANG.GU,
      t: (key) => tForm(language, key),
    }),
    [language]
  );
  return (
    <FormLanguageContext.Provider value={value}>
      {children}
    </FormLanguageContext.Provider>
  );
}

export const useFormLanguage = () => useContext(FormLanguageContext);
