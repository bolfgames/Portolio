export type Language = 'tr' | 'en' | 'de' | 'fr' | 'es' | 'ja' | 'zh';

export interface TranslationKeys {
  nav: {
    home: string;
    about: string;
    projects: string;
    team: string;
    contact: string;
  };
  hero: {
    tagline: string;
    cta: string;
  };
  about: {
    title: string;
    whoAreWe: string;
    mission: string;
    content: {
      paragraph1: string;
      paragraph2: string;
      paragraph3: string;
    };
  };
  projects: {
    title: string;
    subtitle: string;
    viewDetails: string;
  };
  team: {
    title: string;
    subtitle: string;
    backToHome: string;
    notFound: string;
  };
  footer: {
    contact: string;
    socialMedia: string;
    email: string;
    subject: string;
    message: string;
    send: string;
    copyright: string;
  };
  keyboard: {
    placeholder: string;
  };
}

export interface Translations {
  tr: TranslationKeys;
  en: TranslationKeys;
  de: TranslationKeys;
  fr: TranslationKeys;
  es: TranslationKeys;
  ja: TranslationKeys;
  zh: TranslationKeys;
}

