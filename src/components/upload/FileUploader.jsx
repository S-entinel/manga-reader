import React, { useState, useRef } from 'react';

export default function FileUploader({ onFileSelect, isVisible }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef(null);

  const supportedFormats = ['.pdf', '.epub', '.cbz', '.cbr'];

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const extension = '.' + file.name.split('.').pop().toLowerCase();
      return supportedFormats.includes(extension);
    });

    if (validFiles.length === 0) {
      setUploadStatus('No supported files found. Please upload PDF, EPUB, CBZ, or CBR files.');
      return;
    }

    if (validFiles.length !== files.length) {
      setUploadStatus(`${validFiles.length} of ${files.length} files are supported.`);
    } else {
      setUploadStatus(`${validFiles.length} file(s) selected for upload.`);
    }

    // Pass files to parent component
    if (onFileSelect) {
      onFileSelect(validFiles);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (!isVisible) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
          isDragOver 
            ? 'border-purple-500 bg-purple-500 bg-opacity-10' 
            : 'border-gray-600 hover:border-purple-500'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-4">
          <div className="text-6xl">📚</div>
          
          <div>
            <h3 className="text-white text-xl font-semibold mb-2">
              Upload Your Books
            </h3>
            <p className="text-purple-300 mb-4">
              Drag and drop your books here, or click to browse
            </p>
          </div>

          <button
            onClick={openFileDialog}
            className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Choose Files
          </button>

          <div className="text-sm text-gray-400">
            <p>Supported formats:</p>
            <div className="flex justify-center space-x-4 mt-1">
              {supportedFormats.map(format => (
                <span key={format} className="bg-gray-700 px-2 py-1 rounded">
                  {format.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={supportedFormats.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {uploadStatus && (
        <div className="mt-4 p-3 bg-gray-800 border border-gray-700 rounded-lg">
          <p className="text-purple-300 text-sm">{uploadStatus}</p>
        </div>
      )}
    </div>
  );
}