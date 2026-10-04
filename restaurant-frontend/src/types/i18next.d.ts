import type da from "../i18n/locales/da.json";

/*
 * da.json is the source language and types t() — add keys there and in en.json.
 * Use: const { t } = useTranslation(); t("map.nearby", { term }).
 * Counts take _one/_other suffixes and a count option.
 */
declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof da;
    };
  }
}
