// import the original type declarations
import "react-i18next";
// import all namespaces (for the default language, only)
import en from "./locales/en";
import zhTW from "./locales/zh-TW";

// react-i18next versions higher than 11.11.0
declare module "react-i18next" {
  interface CustomTypeOptions {
    // custom namespace type if you changed it
    defaultNS: "translation";
    // custom resources type
    resources: {
      en: typeof en;
      "zh-TW": typeof zhTW;
    };
  }
}
