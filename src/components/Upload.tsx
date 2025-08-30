import React, { useState, useCallback, useRef } from 'react';
import { Upload as UploadIcon, Plus, X, Image, Video, FolderPlus, Check, AlertCircle } from 'lucide-react';
import { useDrive } from '../contexts/DriveContext';

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

export function Upload() {
  const { uploadFiles, createFolder, currentFolder } = useDrive();
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [showFolderForm, setShowFolderForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/') || file.type.startsWith('video/')
    );
    
    addFiles(files);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (files: File[]) => {
    const newUploadFiles = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'pending' as const,
    }));
    
    setUploadFiles(prev => [...prev, ...newUploadFiles]);
  };

  const removeFile = (id: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== id));
  };

  const startUpload = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === 'pending');
    
    for (const uploadFile of pendingFiles) {
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id ? { ...f, status: 'uploading' } : f
      ));

      try {
        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setUploadFiles(prev => prev.map(f => 
            f.id === uploadFile.id ? { ...f, progress: i } : f
          ));
        }

        // Call actual upload function
        await uploadFiles([uploadFile.file], currentFolder?.id);
        
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { ...f, status: 'completed', progress: 100 } : f
        ));
      } catch (error) {
        setUploadFiles(prev => prev.map(f => 
          f.id === uploadFile.id ? { 
            ...f, 
            status: 'error', 
            error: error instanceof Error ? error.message : 'Upload failed'
          } : f
        ));
      }
    }
  };

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    
    try {
      await createFolder(newFolderName, currentFolder?.id);
      setNewFolderName('');
      setShowFolderForm(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-sm"
        >
          <Plus size={20} />
          <span>Select Files</span>
        </button>
        
        <button
          onClick={() => setShowFolderForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200 shadow-sm"
        >
          <FolderPlus size={20} />
          <span>New Folder</span>
        </button>
      </div>

      {/* Create Folder Form */}
      {showFolderForm && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Create New Folder</h3>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Folder name (e.g., Sports Day 2025)"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
            />
            <button
              onClick={handleCreateFolder}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
            >
              Create
            </button>
            <button
              onClick={() => setShowFolderForm(false)}
              className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <UploadIcon size={48} className={`mx-auto mb-4 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">
          {isDragging ? 'Drop files here' : 'Upload Photos & Videos'}
        </h3>
        <p className="text-gray-600 mb-4">
          Drag and drop your files here, or click to select files
        </p>
        <p className="text-sm text-gray-500">
          Supports: JPG, PNG, GIF, MP4, MOV, AVI (Max 100MB per file)
        </p>
      </div>

      {/* Upload Queue */}
      {uploadFiles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Upload Queue ({uploadFiles.length} files)
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={startUpload}
                disabled={uploadFiles.some(f => f.status === 'uploading')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
              >
                Start Upload
              </button>
              <button
                onClick={() => setUploadFiles([])}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Clear All
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {uploadFiles.map((uploadFile) => (
              <div key={uploadFile.id} className="flex items-center space-x-4 p-4 border-b border-gray-100 last:border-b-0">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                  {uploadFile.file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(uploadFile.file)}
                      alt={uploadFile.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Video size={24} className="text-gray-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-800 truncate">{uploadFile.file.name}</h4>
                  <p className="text-sm text-gray-500">{formatFileSize(uploadFile.file.size)}</p>
                  
                  {uploadFile.status === 'uploading' && (
                    <div className="mt-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-blue-600 mt-1">{uploadFile.progress}% uploaded</p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {uploadFile.status === 'completed' && (
                    <Check size={20} className="text-green-600" />
                  )}
                  {uploadFile.status === 'error' && (
                    <AlertCircle size={20} className="text-red-600" title={uploadFile.error} />
                  )}
                  {uploadFile.status === 'pending' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(uploadFile.id);
                      }}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors duration-200"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}