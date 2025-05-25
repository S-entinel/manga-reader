import React, { useState, useEffect } from 'react'
import { settingsService } from './services/storage/settingsService'
import { bookStorageService } from './services/storage/bookStorageService'
import SettingsPanel from './components/common/SettingsPanel'
import FileUploader from './components/upload/FileUploader'
import LibraryView from './components/library/LibraryView'

function App() {
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState('library'); // 'library' or 'upload'
  const [books, setBooks] = useState([]);

  // Load books on component mount
  useEffect(() => {
    setBooks(bookStorageService.getAllBooks());
  }, []);

  // Listen for settings changes
  useEffect(() => {
    const interval = setInterval(() => {
      setSettings(settingsService.getSettings());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = (files) => {
    const newBooks = files.map(file => {
      // For now, we'll create basic book entries
      // In the next step, we'll add proper file processing
      return bookStorageService.addBook({
        name: file.name,
        size: file.size,
        totalPages: Math.floor(Math.random() * 200) + 50, // Placeholder
      });
    });

    setBooks(bookStorageService.getAllBooks());
    setCurrentView('library');
  };

  const handleBookSelect = (book) => {
    // For now, just show an alert - we'll build the reader next
    alert(`Opening "${book.title}" - Reader coming in next step!`);
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'}`}>
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-white text-xl font-bold">Manga Reader</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <nav className="flex space-x-4">
                <button
                  onClick={() => setCurrentView('library')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'library' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  Library
                </button>
                <button
                  onClick={() => setCurrentView('upload')}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentView === 'upload' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-purple-300 hover:text-white'
                  }`}
                >
                  Upload
                </button>
              </nav>
              
              <button
                onClick={() => setShowSettings(true)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⚙️ Settings
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {currentView === 'upload' && (
          <FileUploader 
            onFileSelect={handleFileSelect}
            isVisible={true}
          />
        )}
        
        {currentView === 'library' && (
          <LibraryView
            books={books}
            onBookSelect={handleBookSelect}
          />
        )}
      </main>

      <SettingsPanel 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)} 
      />
    </div>
  )
}

export default App