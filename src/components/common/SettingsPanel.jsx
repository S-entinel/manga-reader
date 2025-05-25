import React, { useState, useEffect } from 'react';
import { settingsService } from '../../services/storage/settingsService';

export default function SettingsPanel({ isOpen, onClose }) {
  const [settings, setSettings] = useState(settingsService.getSettings());

  useEffect(() => {
    setSettings(settingsService.getSettings());
  }, [isOpen]);

  const handleSettingChange = (key, value) => {
    settingsService.updateSetting(key, value);
    setSettings(settingsService.getSettings());
  };

  const handleReset = () => {
    if (confirm('Reset all settings to default? This cannot be undone.')) {
      const resetSettings = settingsService.resetSettings();
      setSettings(resetSettings);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-xl font-bold">Settings</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Theme Settings */}
          <div>
            <h3 className="text-white font-semibold mb-3">Appearance</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Theme</label>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                  <option value="sepia">Sepia</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">
                  Font Size: {settings.fontSize}px
                </label>
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={settings.fontSize}
                  onChange={(e) => handleSettingChange('fontSize', parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">
                  Brightness: {settings.brightness}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={settings.brightness}
                  onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Reading Settings */}
          <div>
            <h3 className="text-white font-semibold mb-3">Reading</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-purple-200 text-sm mb-2">Reading Mode</label>
                <select
                  value={settings.readingMode}
                  onChange={(e) => handleSettingChange('readingMode', e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                >
                  <option value="single">Single Page</option>
                  <option value="double">Double Page</option>
                  <option value="continuous">Continuous Scroll</option>
                </select>
              </div>

              <div>
                <label className="block text-purple-200 text-sm mb-2">Reading Direction</label>
                <select
                  value={settings.readingDirection}
                  onChange={(e) => handleSettingChange('readingDirection', e.target.value)}
                  className="w-full bg-slate-700 text-white px-3 py-2 rounded-lg border border-slate-600"
                >
                  <option value="ltr">Left to Right</option>
                  <option value="rtl">Right to Left (Manga)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-purple-200">Show Page Numbers</span>
                <button
                  onClick={() => handleSettingChange('showPageNumbers', !settings.showPageNumbers)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.showPageNumbers ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.showPageNumbers ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Feature Settings */}
          <div>
            <h3 className="text-white font-semibold mb-3">Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-purple-200">Bionic Reading</span>
                <button
                  onClick={() => handleSettingChange('bionicReading', !settings.bionicReading)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.bionicReading ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.bionicReading ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-purple-200">Translation</span>
                <button
                  onClick={() => handleSettingChange('translationEnabled', !settings.translationEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.translationEnabled ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.translationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-purple-200">Auto Save Progress</span>
                <button
                  onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                  className={`w-12 h-6 rounded-full transition-colors ${
                    settings.autoSave ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      settings.autoSave ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={handleReset}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}