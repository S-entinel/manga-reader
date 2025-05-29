import React, { useState, useEffect } from 'react';
import { bookStorageService } from '../../services/storage/bookStorageService';
import { useKeyboardNavigation } from '../../hooks/useKeyboardNavigation';

export default function BookReader({ book, onClose }) {
  const [currentPage, setCurrentPage] = useState(book?.currentPage || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [pageContent, setPageContent] = useState(null);

  useKeyboardNavigation({
    onNextPage: nextPage,
    onPrevPage: prevPage,
    onClose: onClose,
  });

  useEffect(() => {
    if (book) {
      loadPage(currentPage);
    }
  }, [book]);

  const loadPage = async (pageNum) => {
    setIsLoading(true);
    setError('');

    try {
      const content = await bookStorageService.getPageContent(book.id, pageNum);
      setPageContent(content);
      
      if (pageNum !== book.currentPage) {
        bookStorageService.updateProgress(book.id, pageNum);
      }
    } catch (err) {
      setError(`Failed to load page ${pageNum}: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  function nextPage() {
    if (currentPage < book.totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      loadPage(newPage);
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      loadPage(newPage);
    }
  }

  const goToPage = (pageNum) => {
    const page = Math.max(1, Math.min(pageNum, book.totalPages));
    setCurrentPage(page);
    loadPage(page);
  };

  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 z-50">
      {/* Reader Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors px-3 py-1 rounded hover:bg-gray-700"
            >
              ← Back
            </button>
            <div>
              <h1 className="text-white font-semibold truncate max-w-md">
                {book.title}
              </h1>
              <p className="text-gray-400 text-sm">
                {book.format.toUpperCase()} • {book.totalPages} pages
                {book.author && ` • ${book.author}`}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Page Navigation */}
            <div className="flex items-center space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage <= 1}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-3 py-1 rounded transition-colors"
              >
                ← Prev
              </button>
              
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={book.totalPages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 bg-gray-700 text-white text-center rounded border border-gray-600 focus:border-purple-500 focus:outline-none"
                />
                <span className="text-gray-400 text-sm">
                  / {book.totalPages}
                </span>
              </div>

              <button
                onClick={nextPage}
                disabled={currentPage >= book.totalPages}
                className="bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 text-white px-3 py-1 rounded transition-colors"
              >
                Next →
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-32 bg-gray-700 rounded-full h-2">
              <div
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentPage / book.totalPages) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Reader Content */}
      <main className="h-full overflow-auto" style={{ height: 'calc(100vh - 120px)' }}>
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-white text-center">
              <div className="text-4xl mb-4 animate-pulse">📄</div>
              <p>Loading page {currentPage}...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-red-400 text-center max-w-md">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="mb-4">{error}</p>
              <div className="space-x-2">
                <button
                  onClick={() => loadPage(currentPage)}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Retry
                </button>
                <button
                  onClick={onClose}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Back to Library
                </button>
              </div>
            </div>
          </div>
        )}

        {!isLoading && !error && pageContent && (
          <div className="h-full">
            <div 
              className="bg-white shadow-2xl mx-auto my-4 rounded-lg overflow-hidden"
              style={{ maxWidth: '900px', minHeight: 'calc(100vh - 160px)' }}
              dangerouslySetInnerHTML={{ __html: pageContent.html }}
            />
          </div>
        )}
      </main>

      {/* Reader Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Page {currentPage} of {book.totalPages}</span>
            <span>•</span>
            <span>{Math.round((currentPage / book.totalPages) * 100)}% complete</span>
            <span>•</span>
            <span>{pageContent?.type || 'content'}</span>
          </div>
          <div>
            Last read: {book.lastRead ? new Date(book.lastRead).toLocaleString() : 'Never'}
          </div>
        </div>
      </footer>
    </div>
  );
}