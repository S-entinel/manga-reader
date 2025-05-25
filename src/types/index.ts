// This will hold all your TypeScript interfaces
export interface Book {
    id: string;
    title: string;
    author?: string;
    format: 'pdf' | 'epub' | 'cbz' | 'cbr';
    coverImage?: string;
    totalPages: number;
    currentPage: number;
    dateAdded: Date;
    lastRead?: Date;
    fileSize: number;
    tags: string[];
  }
  
  export interface ReadingSettings {
    theme: 'light' | 'dark' | 'sepia';
    readingMode: 'single' | 'double' | 'continuous';
    bionicReading: boolean;
    translationEnabled: boolean;
    fontSize: number;
    brightness: number;
  }