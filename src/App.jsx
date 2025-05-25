import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <h1 className="text-white text-xl font-bold">Manga Reader</h1>
            </div>
            <div className="text-purple-300 text-sm">
              Portfolio Project
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          {/* Welcome Section */}
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to Your Manga Library
            </h2>
            <p className="text-purple-200 text-lg max-w-2xl mx-auto">
              Upload your books and enjoy reading with translation, bionic reading, 
              and a beautiful anime-inspired interface.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-pink-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">📚</span>
              </div>
              <h3 className="text-white font-bold mb-2">Local Library</h3>
              <p className="text-purple-200 text-sm">
                Upload and manage your books locally with full offline support.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🌐</span>
              </div>
              <h3 className="text-white font-bold mb-2">Translation</h3>
              <p className="text-purple-200 text-sm">
                Real-time translation from Japanese to English with OCR support.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <h3 className="text-white font-bold mb-2">Bionic Reading</h3>
              <p className="text-purple-200 text-sm">
                Enhanced reading experience with bionic text processing.
              </p>
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white/5 backdrop-blur-md rounded-xl p-8 border border-white/10">
            <h3 className="text-white text-xl font-bold mb-4">Development Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">Project Setup</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs">Complete</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">Storage System</span>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs">Next</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">File Processing</span>
                <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">Pending</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-purple-200">Reading Interface</span>
                <span className="bg-gray-500 text-white px-2 py-1 rounded-full text-xs">Pending</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-purple-300 text-sm">
            Built with React, Vite, and Tailwind CSS • Portfolio Project
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App