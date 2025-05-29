import { indexedDBService } from '../storage/indexedDBService';
import { pdfParser } from './pdfParser';

class FileProcessor {
  constructor() {
    this.supportedFormats = ['pdf', 'epub', 'cbz', 'cbr'];
  }

  async processFile(file, bookId) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    if (!this.supportedFormats.includes(fileExtension)) {
      throw new Error(`Unsupported file format: ${fileExtension}`);
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      await indexedDBService.storeFile(bookId, arrayBuffer, file.name);

      let fileInfo = {
        format: fileExtension,
        size: file.size,
        name: file.name,
        totalPages: 1
      };

      // Process based on file type
      switch (fileExtension) {
        case 'pdf':
          fileInfo = await this.processPDF(arrayBuffer, fileInfo);
          break;
        case 'epub':
          fileInfo = await this.processEPUB(arrayBuffer, fileInfo);
          break;
        case 'cbz':
        case 'cbr':
          fileInfo = await this.processComic(arrayBuffer, fileInfo);
          break;
        default:
          fileInfo.totalPages = this.estimatePageCount(arrayBuffer, fileExtension);
      }

      console.log(`Processed ${fileExtension.toUpperCase()} file: ${file.name}`);
      return fileInfo;

    } catch (error) {
      console.error('Error processing file:', error);
      throw new Error(`Failed to process file: ${error.message}`);
    }
  }

  // Process PDF files
  async processPDF(arrayBuffer, fileInfo) {
    try {
      const pdfData = await pdfParser.parsePDF(arrayBuffer);
      const metadata = await pdfParser.getPDFMetadata(arrayBuffer);
      
      return {
        ...fileInfo,
        totalPages: pdfData.pageCount,
        title: metadata?.title || fileInfo.name.replace(/\.[^/.]+$/, ''),
        author: metadata?.author || '',
        metadata: {
          subject: metadata?.subject || '',
          creator: metadata?.creator || '',
          producer: metadata?.producer || '',
          creationDate: metadata?.creationDate,
          modificationDate: metadata?.modificationDate
        }
      };
    } catch (error) {
      console.error('Error processing PDF:', error);
      // Fallback to basic info
      return {
        ...fileInfo,
        totalPages: this.estimatePageCount(arrayBuffer, 'pdf')
      };
    }
  }

  // Process EPUB files (placeholder)
  async processEPUB(arrayBuffer, fileInfo) {
    // Placeholder - we'll implement this in a future step
    return {
      ...fileInfo,
      totalPages: Math.max(1, Math.floor(arrayBuffer.byteLength / (1024 * 50))) // Rough estimate
    };
  }

  // Process comic files (placeholder)
  async processComic(arrayBuffer, fileInfo) {
    // Placeholder - we'll implement this in a future step
    return {
      ...fileInfo,
      totalPages: Math.max(1, Math.floor(arrayBuffer.byteLength / (1024 * 200))) // Rough estimate
    };
  }

  // Estimate page count for unknown formats
  estimatePageCount(arrayBuffer, format) {
    const fileSizeInMB = arrayBuffer.byteLength / (1024 * 1024);
    
    switch (format) {
      case 'pdf':
        return Math.max(1, Math.floor(fileSizeInMB * 10));
      case 'epub':
        return Math.max(1, Math.floor(fileSizeInMB * 20));
      case 'cbz':
      case 'cbr':
        return Math.max(1, Math.floor(fileSizeInMB * 5));
      default:
        return 1;
    }
  }

  // Get page content for reading
  async getPageContent(bookId, pageNumber, format) {
    try {
      const fileRecord = await indexedDBService.getFile(bookId);
      if (!fileRecord) {
        throw new Error('File not found');
      }

      switch (format) {
        case 'pdf':
          return await this.getPDFPageContent(fileRecord.data, pageNumber);
        case 'epub':
          return await this.getEPUBPageContent(fileRecord.data, pageNumber);
        case 'cbz':
        case 'cbr':
          return await this.getComicPageContent(fileRecord.data, pageNumber);
        default:
          return this.getPlaceholderContent(pageNumber, format);
      }
    } catch (error) {
      console.error('Error getting page content:', error);
      throw error;
    }
  }

  // Get PDF page content
  async getPDFPageContent(arrayBuffer, pageNumber) {
    try {
      const imageDataUrl = await pdfParser.getPageAsImage(arrayBuffer, pageNumber);
      const textContent = await pdfParser.extractTextFromPage(arrayBuffer, pageNumber);
      
      return {
        type: 'pdf',
        pageNumber,
        imageUrl: imageDataUrl,
        textContent: textContent,
        html: `
          <div style="display: flex; flex-direction: column; align-items: center; padding: 20px;">
            <img src="${imageDataUrl}" style="max-width: 100%; height: auto; box-shadow: 0 4px 8px rgba(0,0,0,0.2); margin-bottom: 20px;" alt="PDF Page ${pageNumber}" />
            <div style="max-width: 800px; padding: 20px; background: #f8f9fa; border-radius: 8px; font-family: Georgia, serif; line-height: 1.6;">
              <h4 style="color: #495057; margin-top: 0;">📄 Extracted Text</h4>
              <p style="white-space: pre-line; color: #333;">${textContent}</p>
            </div>
          </div>
        `
      };
    } catch (error) {
      console.error('Error getting PDF page:', error);
      return this.getErrorContent(pageNumber, 'PDF', error.message);
    }
  }

  // Placeholder for EPUB content
  async getEPUBPageContent(arrayBuffer, pageNumber) {
    return this.getPlaceholderContent(pageNumber, 'EPUB');
  }

  // Placeholder for comic content
  async getComicPageContent(arrayBuffer, pageNumber) {
    return this.getPlaceholderContent(pageNumber, 'Comic');
  }

  // Generate placeholder content
  getPlaceholderContent(pageNumber, format) {
    return {
      type: 'placeholder',
      pageNumber,
      html: `
        <div style="padding: 40px; font-family: Georgia, serif; line-height: 1.8; max-width: 800px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 40px;">
            <h2 style="color: #333;">📚 ${format.toUpperCase()} Page ${pageNumber}</h2>
            <p style="color: #666; font-style: italic;">Content parsing for ${format.toUpperCase()} files coming soon!</p>
          </div>
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; border-left: 4px solid #2196f3;">
            <p>This is a placeholder for ${format.toUpperCase()} page ${pageNumber}. The file has been successfully stored and is ready for parsing.</p>
            <p>Upcoming features for ${format.toUpperCase()} files:</p>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li>Content extraction and display</li>
              <li>Text-based search</li>
              <li>Translation support</li>
              <li>Bionic reading formatting</li>
            </ul>
          </div>
        </div>
      `
    };
  }

  // Generate error content
  getErrorContent(pageNumber, format, errorMessage) {
    return {
      type: 'error',
      pageNumber,
      html: `
        <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
          <div style="color: #dc3545; margin-bottom: 20px;">
            <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
            <h3>Error Loading ${format} Page ${pageNumber}</h3>
            <p style="color: #666; font-size: 14px; max-width: 400px; margin: 0 auto;">${errorMessage}</p>
          </div>
        </div>
      `
    };
  }

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

  async isFileStored(bookId) {
    try {
      const fileRecord = await indexedDBService.getFile(bookId);
      return !!fileRecord;
    } catch (error) {
      return false;
    }
  }

  async getStorageUsage() {
    return await indexedDBService.getStorageInfo();
  }

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