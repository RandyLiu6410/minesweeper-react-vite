import en from "./locales/en";
import zhTW from "./locales/zh-TW";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const defaultNS = "en";
export const resources = {
  en: en,
  "zh-TW": zhTW,
} as const;

export const i18nInstance = i18n.use(initReactI18next);

i18nInstance.init(
  {
    fallbackLng: "zh-TW",
    ns: ["translation"],
    defaultNS: "translation",
    resources,
    interpolation: {
      escapeValue: false,
    },
  },
  (err) => {
    console.log(err);
  }
);

export default i18nInstance;
