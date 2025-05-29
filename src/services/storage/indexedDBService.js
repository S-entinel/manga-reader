class IndexedDBService {
    constructor() {
      this.dbName = 'manga-reader-db';
      this.version = 1;
      this.db = null;
    }
  
    // Initialize the database
    async init() {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open(this.dbName, this.version);
  
        request.onerror = () => {
          reject(new Error('Failed to open IndexedDB'));
        };
  
        request.onsuccess = () => {
          this.db = request.result;
          resolve(this.db);
        };
  
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
  
          // Create object store for book files
          if (!db.objectStoreNames.contains('bookFiles')) {
            const bookStore = db.createObjectStore('bookFiles', { keyPath: 'id' });
            bookStore.createIndex('bookId', 'bookId', { unique: false });
          }
  
          // Create object store for book pages/content
          if (!db.objectStoreNames.contains('bookPages')) {
            const pageStore = db.createObjectStore('bookPages', { keyPath: 'id' });
            pageStore.createIndex('bookId', 'bookId', { unique: false });
            pageStore.createIndex('pageNumber', 'pageNumber', { unique: false });
          }
        };
      });
    }
  
    // Store a complete file
    async storeFile(bookId, fileData, fileName) {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['bookFiles'], 'readwrite');
        const store = transaction.objectStore('bookFiles');
  
        const fileRecord = {
          id: bookId,
          bookId: bookId,
          fileName: fileName,
          data: fileData,
          storedAt: new Date()
        };
  
        const request = store.put(fileRecord);
  
        request.onsuccess = () => resolve(fileRecord);
        request.onerror = () => reject(new Error('Failed to store file'));
      });
    }
  
    // Get a file by book ID
    async getFile(bookId) {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['bookFiles'], 'readonly');
        const store = transaction.objectStore('bookFiles');
        const request = store.get(bookId);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to retrieve file'));
      });
    }
  
    // Store individual pages (for processed content)
    async storePage(bookId, pageNumber, pageData) {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['bookPages'], 'readwrite');
        const store = transaction.objectStore('bookPages');
  
        const pageRecord = {
          id: `${bookId}-page-${pageNumber}`,
          bookId: bookId,
          pageNumber: pageNumber,
          data: pageData,
          storedAt: new Date()
        };
  
        const request = store.put(pageRecord);
  
        request.onsuccess = () => resolve(pageRecord);
        request.onerror = () => reject(new Error('Failed to store page'));
      });
    }
  
    // Get a specific page
    async getPage(bookId, pageNumber) {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['bookPages'], 'readonly');
        const store = transaction.objectStore('bookPages');
        const request = store.get(`${bookId}-page-${pageNumber}`);
  
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(new Error('Failed to retrieve page'));
      });
    }
  
    // Get all pages for a book
    async getAllPages(bookId) {
      if (!this.db) await this.init();
  
      return new Promise((resolve, reject) => {
        const transaction = this.db.transaction(['bookPages'], 'readonly');
        const store = transaction.objectStore('bookPages');
        const index = store.index('bookId');
        const request = index.getAll(bookId);
  
        request.onsuccess = () => {
          const pages = request.result.sort((a, b) => a.pageNumber - b.pageNumber);
          resolve(pages);
        };
        request.onerror = () => reject(new Error('Failed to retrieve pages'));
      });
    }
  
    // Delete all data for a book
    async deleteBook(bookId) {
      if (!this.db) await this.init();
  
      const deleteFromStore = (storeName) => {
        return new Promise((resolve, reject) => {
          const transaction = this.db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          
          if (storeName === 'bookFiles') {
            const request = store.delete(bookId);
            request.onsuccess = () => resolve();
            request.onerror = () => reject(new Error(`Failed to delete from ${storeName}`));
          } else {
            // For bookPages, we need to delete by index
            const index = store.index('bookId');
            const request = index.openCursor(bookId);
            
            request.onsuccess = (event) => {
              const cursor = event.target.result;
              if (cursor) {
                cursor.delete();
                cursor.continue();
              } else {
                resolve();
              }
            };
            request.onerror = () => reject(new Error(`Failed to delete from ${storeName}`));
          }
        });
      };
  
      try {
        await deleteFromStore('bookFiles');
        await deleteFromStore('bookPages');
        return true;
      } catch (error) {
        console.error('Error deleting book data:', error);
        return false;
      }
    }
  
    // Get storage usage info
    async getStorageInfo() {
      if (!navigator.storage || !navigator.storage.estimate) {
        return { quota: 0, usage: 0, available: 0 };
      }
  
      try {
        const estimate = await navigator.storage.estimate();
        return {
          quota: estimate.quota || 0,
          usage: estimate.usage || 0,
          available: (estimate.quota || 0) - (estimate.usage || 0)
        };
      } catch (error) {
        console.error('Error getting storage info:', error);
        return { quota: 0, usage: 0, available: 0 };
      }
    }
  }
  
  export const indexedDBService = new IndexedDBService();