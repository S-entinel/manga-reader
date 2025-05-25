import { localStorageService } from './localStorageService';

class BookStorageService {
  constructor() {
    this.booksKey = 'user-books';
    this.books = this.loadBooks();
  }

  // Load all books from storage
  loadBooks() {
    return localStorageService.get(this.booksKey) || [];
  }

  // Save books to storage
  saveBooks() {
    return localStorageService.save(this.booksKey, this.books);
  }

  // Get all books
  getAllBooks() {
    return [...this.books];
  }

  // Add a new book
  addBook(bookData) {
    const book = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      title: bookData.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      author: bookData.author || '',
      format: bookData.name.split('.').pop().toLowerCase(),
      totalPages: bookData.totalPages || 0,
      currentPage: 0,
      dateAdded: new Date(),
      lastRead: null,
      fileSize: bookData.size,
      tags: [],
      fileName: bookData.name,
      // Note: We're not storing the actual file content yet - that's for the next step
    };

    this.books.push(book);
    this.saveBooks();
    return book;
  }

  // Get a specific book
  getBook(bookId) {
    return this.books.find(book => book.id === bookId);
  }

  // Update book progress
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

  // Delete a book
  deleteBook(bookId) {
    const index = this.books.findIndex(book => book.id === bookId);
    if (index > -1) {
      const deletedBook = this.books.splice(index, 1)[0];
      this.saveBooks();
      return deletedBook;
    }
    return null;
  }

  // Search books
  searchBooks(query) {
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }
}

export const bookStorageService = new BookStorageService();