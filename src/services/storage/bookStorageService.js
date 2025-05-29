import { localStorageService } from './localStorageService';
import { fileProcessor } from '../fileProcessing/fileProcessor';

class BookStorageService {
  constructor() {
    this.booksKey = 'user-books';
    this.books = this.loadBooks();
  }

  loadBooks() {
    return localStorageService.get(this.booksKey) || [];
  }

  saveBooks() {
    return localStorageService.save(this.booksKey, this.books);
  }

  getAllBooks() {
    return [...this.books];
  }

  async addBook(file) {
    const bookId = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    
    try {
      const fileInfo = await fileProcessor.processFile(file, bookId);
      
      const book = {
        id: bookId,
        title: fileInfo.title || file.name.replace(/\.[^/.]+$/, ''),
        author: fileInfo.author || '',
        format: fileInfo.format,
        totalPages: fileInfo.totalPages,
        currentPage: 0,
        dateAdded: new Date(),
        lastRead: null,
        fileSize: file.size,
        tags: [],
        fileName: file.name,
        isProcessed: true,
        processingStatus: 'completed',
        metadata: fileInfo.metadata || {}
      };

      this.books.push(book);
      this.saveBooks();
      return book;

    } catch (error) {
      console.error('Error adding book:', error);
      
      const book = {
        id: bookId,
        title: file.name.replace(/\.[^/.]+$/, ''),
        author: '',
        format: file.name.split('.').pop().toLowerCase(),
        totalPages: 0,
        currentPage: 0,
        dateAdded: new Date(),
        lastRead: null,
        fileSize: file.size,
        tags: [],
        fileName: file.name,
        isProcessed: false,
        processingStatus: 'failed',
        error: error.message
      };

      this.books.push(book);
      this.saveBooks();
      throw error;
    }
  }

  getBook(bookId) {
    return this.books.find(book => book.id === bookId);
  }

  updateProgress(bookId, currentPage) {
    const book = this.books.find(book => book.id === bookId);
    if (book) {
      book.currentPage = currentPage;
      book.lastRead = new Date();
      this.saveBooks();
      return book;
    }
    return null;
  }

  async deleteBook(bookId) {
    const index = this.books.findIndex(book => book.id === bookId);
    if (index > -1) {
      const deletedBook = this.books.splice(index, 1)[0];
      
      try {
        await fileProcessor.deleteFile(bookId);
      } catch (error) {
        console.error('Error deleting file data:', error);
      }
      
      this.saveBooks();
      return deletedBook;
    }
    return null;
  }

  searchBooks(query) {
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  async getBookFile(bookId) {
    const book = this.getBook(bookId);
    if (!book || !book.isProcessed) {
      throw new Error('Book not found or not processed');
    }

    return await fileProcessor.getFileForReading(bookId);
  }

  // Get page content for reading
  async getPageContent(bookId, pageNumber) {
    const book = this.getBook(bookId);
    if (!book || !book.isProcessed) {
      throw new Error('Book not found or not processed');
    }

    return await fileProcessor.getPageContent(bookId, pageNumber, book.format);
  }

  async getStorageUsage() {
    return await fileProcessor.getStorageUsage();
  }
}

export const bookStorageService = new BookStorageService();