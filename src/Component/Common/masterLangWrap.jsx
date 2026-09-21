import React from "react";
import { FormLanguageProvider } from "../../context/FormLanguageContext";
import LanguageSwitcher from "../LanguageSwitcher";

export default function MasterLangWrap({ children }) {
  return (
    <FormLanguageProvider defaultLanguage="en">
      <div className="flex justify-end mb-2">
        <LanguageSwitcher variant="inline" />
      </div>
      <div className="pt-2 overflow-visible">{children}</div>
    </FormLanguageProvider>
  );
}
