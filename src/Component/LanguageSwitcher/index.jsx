import React from "react";
import { FORM_LANG } from "../../i18n/yuvaForm";
import { useFormLanguage } from "../../context/FormLanguageContext";

export default function LanguageSwitcher({ variant = "floating" }) {
  const { language, setLanguage } = useFormLanguage();
  const isGu = language === FORM_LANG.GU;
  const compact = variant === "header" || variant === "inline";

  return (
    <div
      className={
        compact
          ? ""
          : "fixed z-[80] right-4 top-20 md:right-6 md:top-24 pointer-events-none"
      }
    >
      <div
        className={`inline-flex items-center gap-1 rounded-full bg-white border border-[#eadfd6] ${
          compact ? "px-1 py-0.5" : "pointer-events-auto shadow-raised pl-3 pr-1.5 py-1.5"
        }`}
        role="group"
        aria-label="Language"
      >
        {compact ? null : (
          <span className="flex items-center gap-2 pr-2 mr-0.5 border-r border-[#eadfd6] min-w-[92px]">
            <span className="w-2 h-2 rounded-full bg-[#e2b13c] shrink-0" />
            <span className="text-sm font-WorkSemiBold text-primary leading-none">
              {isGu ? "ગુજરાતી" : "English"}
            </span>
          </span>
        )}
        <button
          type="button"
          onClick={() => setLanguage(FORM_LANG.EN)}
          className={`min-w-[36px] h-7 px-2 rounded-full text-xs font-WorkSemiBold ${
            !isGu ? "bg-primary text-white" : "text-primary hover:bg-[#f6eee8]"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage(FORM_LANG.GU)}
          className={`min-w-[36px] h-7 px-2 rounded-full text-xs font-WorkSemiBold ${
            isGu ? "bg-primary text-white" : "text-primary hover:bg-[#f6eee8]"
          }`}
        >
          ગુ
        </button>
      </div>
    </div>
  );
}
