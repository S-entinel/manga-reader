import React, { useState, useEffect } from 'react'
import { localStorageService } from './services/storage/localStorageService'

function App() {
  const [testData, setTestData] = useState('');
  const [savedData, setSavedData] = useState('');

  // Load saved data on component mount
  useEffect(() => {
    const loaded = localStorageService.get('test-data');
    if (loaded) {
      setSavedData(loaded);
    }
  }, []);

  const handleSave = () => {
    const success = localStorageService.save('test-data', testData);
    if (success) {
      setSavedData(testData);
      alert('Data saved successfully!');
    } else {
      alert('Failed to save data');
    }
  };

  const handleClear = () => {
    localStorageService.remove('test-data');
    setSavedData('');
    setTestData('');
    alert('Data cleared!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <h1 className="text-white text-xl font-bold">Manga Reader - Storage Test</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h2 className="text-white text-xl font-bold mb-4">Test Local Storage</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-purple-200 text-sm mb-2">
                  Enter test data:
                </label>
                <input
                  type="text"
                  value={testData}
                  onChange={(e) => setTestData(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300"
                  placeholder="Type something to save..."
                />
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  disabled={!testData.trim()}
                  className="flex-1 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-500 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Save Data
                </button>
                <button
                  onClick={handleClear}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Clear Data
                </button>
              </div>

              {savedData && (
                <div className="mt-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-200 text-sm">Saved data:</p>
                  <p className="text-white font-mono">{savedData}</p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-purple-300 text-sm">
              ✅ Step 2A: Basic local storage working!
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App