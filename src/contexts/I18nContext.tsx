import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import I18nService from '../services/i18nService';
import translationsData from '../config/translations.json';
import type { Language, Translations } from '../models/i18n';
import { settingsService } from '../services/settingsService';
import { dataService } from '../services/dataService';
import { platformService } from '../services/platformService';

interface I18nContextType {
  t: (key: string) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  availableLanguages: Array<{ code: Language; name: string; flag: string }>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

/**
 * I18nProvider - Provides i18n context to the app
 * Follows Dependency Inversion Principle
 */
export function I18nProvider({ children }: { children: ReactNode }) {
  const [i18nService] = useState(() => new I18nService(translationsData as Translations));
  const [language, setLanguageState] = useState<Language>(i18nService.getCurrentLanguage());
  const [availableLanguages, setAvailableLanguages] = useState(() => i18nService.getAvailableLanguages());

  useEffect(() => {
    const unsubscribe = i18nService.subscribe((lang) => {
      setLanguageState(lang);
      // Update dataService and platformService language for localized data
      dataService.setLanguage(lang);
      platformService.setLanguage(lang);
    });

    return unsubscribe;
  }, [i18nService]);

  // Listen to settings changes for available languages update
  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      setAvailableLanguages(i18nService.getAvailableLanguages());
    });

    return unsubscribe;
  }, [i18nService]);

  const setLanguage = (lang: Language) => {
    i18nService.setLanguage(lang);
  };

  const value: I18nContextType = {
    t: (key: string) => i18nService.t(key),
    language,
    setLanguage,
    availableLanguages,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

/**
 * useI18n hook - Access i18n context
 */
export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

