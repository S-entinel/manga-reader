class LocalStorageService {
    constructor() {
      this.prefix = 'manga-reader-';
    }
  
    // Save data to localStorage
    save(key, data) {
      try {
        const serializedData = JSON.stringify(data);
        localStorage.setItem(this.prefix + key, serializedData);
        return true;
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
      }
    }
  
    // Get data from localStorage
    get(key) {
      try {
        const item = localStorage.getItem(this.prefix + key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error('Error reading from localStorage:', error);
        return null;
      }
    }
  
    // Remove data from localStorage
    remove(key) {
      try {
        localStorage.removeItem(this.prefix + key);
        return true;
      } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
      }
    }
  
    // Get all keys with our prefix
    getAllKeys() {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keys.push(key.replace(this.prefix, ''));
        }
      }
      return keys;
    }
  }
  
  export const localStorageService = new LocalStorageService();