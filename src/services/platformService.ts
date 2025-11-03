import type { Platform } from '../models/types';
import type { Language } from '../models/i18n';
import translationsData from '../config/translations.json';
import type { Translations } from '../models/i18n';

/**
 * Platform Service - Utility functions for platform-related operations
 * Now supports localization
 */
class PlatformService {
  private currentLanguage: Language = 'tr';
  private translations: Translations = translationsData as Translations;

  /**
   * Set current language for localized platform names
   */
  setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  /**
   * Get platform icon name or identifier
   */
  getPlatformIcon(platform: Platform): string {
    const iconMap: Record<Platform, string> = {
      'PC': '💻',
      'Mobile': '📱',
      'Web': '🌐',
      'Console': '🎮',
    };
    return iconMap[platform] || '🎮';
  }

  /**
   * Get platform display name (localized)
   */
  getPlatformDisplayName(platform: Platform): string {
    const localizedName = this.translations[this.currentLanguage]?.projects?.platforms?.[platform];
    return localizedName || platform;
  }

  /**
   * Format platforms array as string
   */
  formatPlatforms(platforms: Platform[]): string {
    return platforms.map(p => this.getPlatformDisplayName(p)).join(', ');
  }
}

export const platformService = new PlatformService();

