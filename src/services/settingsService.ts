import settingsData from '../config/settings.json';

/**
 * Settings Service - Manages application settings
 * Follows Single Responsibility Principle
 */
export interface Settings {
  features: {
    keyboardAnimation: {
      enabled: boolean;
      description: string;
    };
    developerMode: {
      enabled: boolean;
      description: string;
    };
    tubesCursor: {
      enabled: boolean;
      description: string;
    };
    editorMode: {
      enabled: boolean;
      description: string;
    };
    showMilestone: {
      enabled: boolean;
      description: string;
    };
  };
  languages: {
    enabled: string[];
    default: string;
    description: string;
  };
  particles: {
    count: number;
    colors: Array<{ name: string; value: string }>;
    description: string;
  };
  tubesCursor: {
    colors: string[];
    lights: {
      colors: string[];
      intensity: number;
    };
    description: string;
  };
  cardStyle: {
    projectCardStyle: {
      selected: string;
      options: string[];
      description: string;
    };
    teamCardStyle: {
      selected: string;
      options: string[];
      description: string;
    };
  };
}

class SettingsService {
  private settings: Settings = settingsData as Settings;
  private listeners: Array<() => void> = [];

  /**
   * Subscribe to settings changes
   */
  subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Notify all listeners about settings change
   */
  private notifyListeners(): void {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Get all settings
   */
  getSettings(): Settings {
    return this.settings;
  }

  /**
   * Update settings at runtime (does not persist to file)
   */
  updateSettings(newSettings: Partial<Settings>): void {
    this.settings = { ...this.settings, ...newSettings };
    this.notifyListeners();
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(featurePath: string): boolean {
    const keys = featurePath.split('.');
    let value: any = this.settings;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return value === true;
  }

  /**
   * Get enabled languages
   */
  getEnabledLanguages(): string[] {
    return this.settings.languages.enabled || [];
  }

  /**
   * Get default language
   */
  getDefaultLanguage(): string {
    return this.settings.languages.default || 'tr';
  }

  /**
   * Check if developer mode is enabled
   */
  isDeveloperModeEnabled(): boolean {
    return this.settings.features.developerMode.enabled;
  }

  /**
   * Check if editor mode is enabled
   */
  isEditorModeEnabled(): boolean {
    return this.settings.features.editorMode?.enabled || false;
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.settings.particles.count || 100;
  }

  /**
   * Get particle colors
   */
  getParticleColors(): Array<{ name: string; value: string }> {
    return this.settings.particles.colors || [
      { name: 'blue', value: '#00BFFF' },
      { name: 'orange', value: '#FFA500' },
    ];
  }

  /**
   * Update particle count at runtime
   */
  updateParticleCount(count: number): void {
    if (count >= 0 && count <= 500) {
      this.settings.particles.count = count;
      this.notifyListeners();
    }
  }

  /**
   * Update particle colors at runtime
   */
  updateParticleColors(colors: Array<{ name: string; value: string }>): void {
    this.settings.particles.colors = colors;
    this.notifyListeners();
  }

  /**
   * Get tubes cursor settings
   */
  getTubesCursorSettings(): Settings['tubesCursor'] {
    return this.settings.tubesCursor || {
      colors: ['#f967fb', '#53bc28', '#6958d5'],
      lights: {
        colors: ['#83f36e', '#fe8a2e', '#ff008a', '#60aed5'],
        intensity: 200,
      },
      description: '',
    };
  }

  /**
   * Update tubes cursor settings at runtime
   */
  updateTubesCursorSettings(settings: Partial<Settings['tubesCursor']>): void {
    if (settings.colors) {
      this.settings.tubesCursor.colors = settings.colors;
    }
    if (settings.lights) {
      if (settings.lights.colors) {
        this.settings.tubesCursor.lights.colors = settings.lights.colors;
      }
      if (settings.lights.intensity !== undefined) {
        this.settings.tubesCursor.lights.intensity = settings.lights.intensity;
      }
    }
    this.notifyListeners();
  }

  /**
   * Get current project card style
   */
  getProjectCardStyle(): string {
    return this.settings.cardStyle.projectCardStyle.selected || 'default';
  }

  /**
   * Get current team card style
   */
  getTeamCardStyle(): string {
    return this.settings.cardStyle.teamCardStyle.selected || 'default';
  }

  /**
   * Update project card style at runtime
   */
  updateProjectCardStyle(style: string): void {
    if (this.settings.cardStyle.projectCardStyle.options.includes(style)) {
      this.settings.cardStyle.projectCardStyle.selected = style;
      this.notifyListeners();
    }
  }

  /**
   * Update team card style at runtime
   */
  updateTeamCardStyle(style: string): void {
    if (this.settings.cardStyle.teamCardStyle.options.includes(style)) {
      this.settings.cardStyle.teamCardStyle.selected = style;
      this.notifyListeners();
    }
  }

  /**
   * Get available card style options
   */
  getCardStyleOptions(): string[] {
    return this.settings.cardStyle.projectCardStyle.options || ['default'];
  }
}

export const settingsService = new SettingsService();
