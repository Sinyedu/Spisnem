import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import da from "./locales/da.json";
import en from "./locales/en.json";

export const LANGUAGES = [
  { code: "da", label: "Dansk" },
  { code: "en", label: "English" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const FALLBACK_LANGUAGE: LanguageCode = "da";

const STORAGE_KEY = "spisnem.language";

function isSupported(value: string | null): value is LanguageCode {
  return LANGUAGES.some((language) => language.code === value);
}

function readStoredLanguage(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function storeLanguage(language: string) {
  try {
    localStorage.setItem(STORAGE_KEY, language);
  } catch {
    return;
  }
}

/* Danish is the native language, so it is the starting point for everyone.
 * Only a choice the user made themselves overrides it. */
function initialLanguage(): LanguageCode {
  const stored = readStoredLanguage();
  return isSupported(stored) ? stored : FALLBACK_LANGUAGE;
}

i18n.use(initReactI18next).init({
  resources: {
    da: { translation: da },
    en: { translation: en },
  },
  lng: initialLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  supportedLngs: LANGUAGES.map((language) => language.code),
  interpolation: {
    escapeValue: false,
  },
});

function syncDocumentLanguage(language: string) {
  document.documentElement.lang = language;
}

syncDocumentLanguage(i18n.language);

i18n.on("languageChanged", (language) => {
  syncDocumentLanguage(language);
  storeLanguage(language);
});

export default i18n;
