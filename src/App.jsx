import React, { useState, useEffect } from 'react'
import { settingsService } from './services/storage/settingsService'
import { bookStorageService } from './services/storage/bookStorageService'
import SettingsPanel from './components/common/SettingsPanel'
import FileUploader from './components/upload/FileUploader'
import LibraryView from './components/library/LibraryView'

function App() {
  const [settings, setSettings] = useState(settingsService.getSettings());
  const [showSettings, setShowSettings] = useState(false);
  const [currentView, setCurrentView] = useState('library');
  const [books, setBooks] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  useEffect(() => {
    setBooks(bookStorageService.getAllBooks());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSettings(settingsService.getSettings());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const handleFileSelect = async (files) => {
    setIsProcessing(true);
    setProcessingStatus(`Processing ${files.length} file(s)...`);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProcessingStatus(`Processing ${file.name} (${i + 1}/${files.length})...`);
        
        try {
          await bookStorageService.addBook(file);
        } catch (error) {
          console.error(`Failed to process ${file.name}:`, error);
          // Continue with other files even if one fails
        }
      }

      setBooks(bookStorageService.getAllBooks());
      setCurrentView('library');
      setProcessingStatus('Processing complete!');

    } catch (error) {
      setProcessingStatus('Processing failed: ' + error.message);
    } finally {
      setIsProcessing(false);
      // Clear status after 3 seconds
      setTimeout(() => setProcessingStatus(''), 3000);
    }
  };

  const handleBookSelect = async (book) => {
    if (!book.isProcessed) {
      alert(`"${book.title}" failed to process: ${book.error || 'Unknown error'}`);
      return;
    }

    try {
      const fileData = await bookStorageService.getBookFile(book.id);
      alert(`Opening "${book.title}" - File loaded successfully! Reader interface coming in next step.`);
    } catch (error) {
      alert(`Error loading "${book.title}": ${error.message}`);
    }
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
                  Library ({books.length})
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

      {/* Processing Status */}
      {(isProcessing || processingStatus) && (
        <div className="bg-purple-500 text-white px-4 py-2 text-center">
          {isProcessing && <span className="inline-block animate-spin mr-2">⏳</span>}
          {processingStatus}
        </div>
      )}

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