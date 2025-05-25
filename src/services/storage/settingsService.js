import { localStorageService } from './localStorageService';

// Default settings
const DEFAULT_SETTINGS = {
  theme: 'dark',
  readingMode: 'single',
  bionicReading: false,
  translationEnabled: false,
  fontSize: 16,
  brightness: 100,
  readingDirection: 'ltr', // left-to-right or right-to-left for manga
  autoSave: true,
  showPageNumbers: true,
};

class SettingsService {
  constructor() {
    this.settingsKey = 'user-settings';
    this.settings = this.loadSettings();
  }

  // Load settings from storage or use defaults
  loadSettings() {
    const savedSettings = localStorageService.get(this.settingsKey);
    return savedSettings ? { ...DEFAULT_SETTINGS, ...savedSettings } : DEFAULT_SETTINGS;
  }

  // Get current settings
  getSettings() {
    return { ...this.settings };
  }

  // Get a specific setting
  getSetting(key) {
    return this.settings[key];
  }

  // Update a single setting
  updateSetting(key, value) {
    if (key in DEFAULT_SETTINGS) {
      this.settings[key] = value;
      this.saveSettings();
      return true;
    }
    console.warn(`Unknown setting: ${key}`);
    return false;
  }

  // Update multiple settings at once
  updateSettings(newSettings) {
    const validSettings = {};
    Object.keys(newSettings).forEach(key => {
      if (key in DEFAULT_SETTINGS) {
        validSettings[key] = newSettings[key];
      }
    });
    
    this.settings = { ...this.settings, ...validSettings };
    this.saveSettings();
    return this.settings;
  }

  // Save settings to storage
  saveSettings() {
    return localStorageService.save(this.settingsKey, this.settings);
  }

  // Reset to default settings
  resetSettings() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.saveSettings();
    return this.settings;
  }

  // Export settings (for backup)
  exportSettings() {
    return JSON.stringify(this.settings, null, 2);
  }

  // Import settings (from backup)
  importSettings(settingsJson) {
    try {
      const importedSettings = JSON.parse(settingsJson);
      return this.updateSettings(importedSettings);
    } catch (error) {
      console.error('Error importing settings:', error);
      return false;
    }
  }
}

export const settingsService = new SettingsService();