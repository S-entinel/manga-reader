import React, { useState, useEffect } from 'react'
import { settingsService } from './services/storage/settingsService'
import SettingsPanel from './components/common/SettingsPanel'

function App() {
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [showSettings, setShowSettings] = useState(false);

  // Listen for settings changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSettings(settingsService.getSettings());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen ${settings.theme === 'light' ? 'bg-white' : 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900'}`}>
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-white text-xl font-bold">Manga Reader</h1>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <h2 className="text-white text-xl font-bold mb-4">Current Settings</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-purple-200">Theme:</span>
                <span className="text-white ml-2 capitalize">{settings.theme}</span>
              </div>
              <div>
                <span className="text-purple-200">Reading Mode:</span>
                <span className="text-white ml-2 capitalize">{settings.readingMode}</span>
              </div>
              <div>
                <span className="text-purple-200">Font Size:</span>
                <span className="text-white ml-2">{settings.fontSize}px</span>
              </div>
              <div>
                <span className="text-purple-200">Brightness:</span>
                <span className="text-white ml-2">{settings.brightness}%</span>
              </div>
              <div>
                <span className="text-purple-200">Bionic Reading:</span>
                <span className="text-white ml-2">{settings.bionicReading ? 'On' : 'Off'}</span>
              </div>
              <div>
                <span className="text-purple-200">Translation:</span>
                <span className="text-white ml-2">{settings.translationEnabled ? 'On' : 'Off'}</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <p className="text-purple-300 text-sm">
              Click the settings button to customize your preferences.
            </p>
          </div>
        </div>
      </main>

      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
}

export default App