import React from 'react';

export default function LibraryView({ books, onBookSelect }) {
  if (!books || books.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        <h3 className="text-white text-xl font-semibold mb-2">No Books Yet</h3>
        <p className="text-purple-300">Upload some books to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-white text-2xl font-bold">Your Library</h2>
        <div className="text-purple-300 text-sm">
          {books.length} book{books.length !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {books.map(book => (
          <div
            key={book.id}
            className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-purple-500 transition-colors cursor-pointer"
            onClick={() => onBookSelect && onBookSelect(book)}
          >
            <div className="flex items-start space-x-3">
              <div className="w-12 h-16 bg-purple-500 rounded flex items-center justify-center text-white font-bold">
                {book.format.toUpperCase()}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold truncate">
                  {book.title}
                </h3>
                {book.author && (
                  <p className="text-purple-300 text-sm truncate">
                    {book.author}
                  </p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <span>{book.totalPages} pages</span>
                  <span>{(book.fileSize / 1024 / 1024).toFixed(1)} MB</span>
                </div>
                {book.currentPage > 0 && (
                  <div className="mt-2">
                    <div className="text-xs text-purple-300 mb-1">
                      Page {book.currentPage} of {book.totalPages}
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-1">
                      <div 
                        className="bg-purple-500 h-1 rounded-full" 
                        style={{ width: `${(book.currentPage / book.totalPages) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}