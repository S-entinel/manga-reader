import { indexedDBService } from '../storage/indexedDBService';

class FileProcessor {
  constructor() {
    this.supportedFormats = ['pdf', 'epub', 'cbz', 'cbr'];
  }

  // Process an uploaded file
  async processFile(file, bookId) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!this.supportedFormats.includes(fileExtension)) {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }

    try {
      // Store the raw file first
      const arrayBuffer = await file.arrayBuffer();
      await indexedDBService.storeFile(bookId, arrayBuffer, file.name);

      // Get basic file info
      const fileInfo = {
        format: fileExtension,
        size: file.size,
        name: file.name,
        totalPages: await this.getPageCount(arrayBuffer, fileExtension)
      };

      console.log(`Processed ${fileExtension.toUpperCase()} file: ${file.name}`);
      return fileInfo;

    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  // Get approximate page count (placeholder implementation)
  async getPageCount(arrayBuffer, format) {
    // For now, return estimated page counts
    // In future steps, we'll implement proper parsing for each format
    const fileSizeInMB = arrayBuffer.byteLength / (1024 * 1024);
    
    switch (format) {
      case 'pdf':
        // Rough estimate: 1 page per 100KB for PDFs
        return Math.max(1, Math.floor(fileSizeInMB * 10));
      case 'epub':
        // Rough estimate: 1 page per 50KB for EPUB
        return Math.max(1, Math.floor(fileSizeInMB * 20));
      case 'cbz':
      case 'cbr':
        // Comic books: estimate based on average image file size
        return Math.max(1, Math.floor(fileSizeInMB * 5));
      default:
        return 1;
    }
  }

  // Get file data for reading
  async getFileForReading(bookId) {
    try {
      const fileRecord = await indexedDBService.getFile(bookId);
      if (!fileRecord) {
        throw new Error('File not found');
      }

      return {
        data: fileRecord.data,
        fileName: fileRecord.fileName,
        bookId: bookId
      };
    } catch (error) {
      console.error('Error getting file for reading:', error);
      throw error;
    }
  }

  // Check if file is processed and stored
  async isFileStored(bookId) {
    try {
      const fileRecord = await indexedDBService.getFile(bookId);
      return !!fileRecord;
    } catch (error) {
      return false;
    }
  }

  // Get storage usage information
  async getStorageUsage() {
    return await indexedDBService.getStorageInfo();
  }

  // Delete processed file
  async deleteFile(bookId) {
    try {
      return await indexedDBService.deleteBook(bookId);
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }
}

export const fileProcessor = new FileProcessor();