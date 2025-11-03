import type { Language, Translations } from '../models/i18n';
import { settingsService } from './settingsService';

/**
 * Internationalization Service
 * Follows Single Responsibility Principle
 * Handles all translation logic
 */
class I18nService {
  private currentLanguage: Language = 'tr';
  private translations: Translations;
  private listeners: Array<(lang: Language) => void> = [];

  constructor(translations: Translations) {
    this.translations = translations;
    
    // Get default language from settings
    const defaultLang = settingsService.getDefaultLanguage() as Language;
    
    // Load saved language from localStorage or use default from settings
    const savedLang = localStorage.getItem('bolf-lang') as Language | null;
    if (savedLang && this.isValidLanguage(savedLang)) {
      this.currentLanguage = savedLang;
    } else if (defaultLang && this.isValidLanguage(defaultLang)) {
      this.currentLanguage = defaultLang;
    }
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  /**
   * Set language
   */
  setLanguage(language: Language): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}`);
      return;
    }

    this.currentLanguage = language;
    localStorage.setItem('bolf-lang', language);
    this.notifyListeners();
  }

  /**
   * Translate a key
   */
  t(key: string): string {
    const keys = key.split('.');
    let value: any = this.translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English if key not found in current language
        const enValue = this.getTranslationFallback(key);
        if (enValue) return enValue;
        
        // If still not found, return key without warning (to avoid console spam)
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Fallback to English translation
   */
  private getTranslationFallback(key: string): string | null {
    if (this.currentLanguage === 'en') return null;
    
    const keys = key.split('.');
    let value: any = this.translations.en;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }

    return typeof value === 'string' ? value : null;
  }

  /**
   * Subscribe to language changes
   */
  subscribe(listener: (lang: Language) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  /**
   * Validate language
   */
  private isValidLanguage(lang: string): lang is Language {
    return ['tr', 'en', 'de', 'fr', 'es', 'ja', 'zh'].includes(lang);
  }

  /**
   * Get all available languages (filtered by settings)
   */
  getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
    const allLanguages = [
      { code: 'tr' as Language, name: 'Türkçe', flag: '🇹🇷' },
      { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
      { code: 'de' as Language, name: 'Deutsch', flag: '🇩🇪' },
      { code: 'fr' as Language, name: 'Français', flag: '🇫🇷' },
      { code: 'es' as Language, name: 'Español', flag: '🇪🇸' },
      { code: 'ja' as Language, name: '日本語', flag: '🇯🇵' },
      { code: 'zh' as Language, name: '中文', flag: '🇨🇳' },
    ];

    // Filter by enabled languages from settings
    const enabledLanguages = settingsService.getEnabledLanguages();
    return allLanguages.filter(lang => enabledLanguages.includes(lang.code));
  }
}

export default I18nService;

