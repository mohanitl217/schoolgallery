import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  size: string;
}

interface Folder {
  id: string;
  name: string;
  parentId?: string;
  fileCount: number;
}

interface DriveContextType {
  files: MediaFile[];
  folders: Folder[];
  currentFolder: Folder | null;
  loading: boolean;
  setCurrentFolder: (folder: Folder | null) => void;
  uploadFiles: (files: File[], folderId?: string) => Promise<void>;
  createFolder: (name: string, parentId?: string) => Promise<void>;
  deleteFolder: (folderId: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
}

const DriveContext = createContext<DriveContextType | undefined>(undefined);

export function useDrive() {
  const context = useContext(DriveContext);
  if (!context) {
    throw new Error('useDrive must be used within a DriveProvider');
  }
  return context;
}

interface DriveProviderProps {
  children: ReactNode;
}

export function DriveProvider({ children }: DriveProviderProps) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentFolder, setCurrentFolder] = useState<Folder | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data for demonstration
  useEffect(() => {
    loadMockData();
  }, [currentFolder]);

  const loadMockData = async () => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock folders
    setFolders([
      { id: '1', name: '2024', fileCount: 245 },
      { id: '2', name: '2025', fileCount: 67 },
      { id: '3', name: 'Sports Day', parentId: currentFolder?.id, fileCount: 89 },
      { id: '4', name: 'Annual Function', parentId: currentFolder?.id, fileCount: 156 },
    ]);

    // Mock files
    setFiles([
      {
        id: '1',
        name: 'sports-day-1.jpg',
        type: 'image',
        url: 'https://images.pexels.com/photos/159654/children-soccer-football-boys-159654.jpeg',
        thumbnailUrl: 'https://images.pexels.com/photos/159654/children-soccer-football-boys-159654.jpeg?w=300',
        createdAt: '2024-03-15',
        size: '2.4 MB'
      },
      {
        id: '2',
        name: 'annual-function-dance.mp4',
        type: 'video',
        url: 'https://videos.pexels.com/video-files/3843433/3843433-uhd_2560_1440_25fps.mp4',
        thumbnailUrl: 'https://images.pexels.com/photos/1708936/pexels-photo-1708936.jpeg?w=300',
        createdAt: '2024-12-20',
        size: '45.6 MB'
      },
      {
        id: '3',
        name: 'science-fair-project.jpg',
        type: 'image',
        url: 'https://images.pexels.com/photos/159775/science-children-win-159775.jpeg',
        thumbnailUrl: 'https://images.pexels.com/photos/159775/science-children-win-159775.jpeg?w=300',
        createdAt: '2025-01-10',
        size: '1.8 MB'
      },
      {
        id: '4',
        name: 'graduation-ceremony.jpg',
        type: 'image',
        url: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg',
        thumbnailUrl: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?w=300',
        createdAt: '2024-06-15',
        size: '3.2 MB'
      }
    ]);
    
    setLoading(false);
  };

  const uploadFiles = async (files: File[], folderId?: string) => {
    // Demo implementation - simulate upload
    console.log('Demo: Uploading files:', files.map(f => f.name));
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Add uploaded files to the mock data
    const newFiles = files.map((file, index) => ({
      id: `uploaded-${Date.now()}-${index}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' as const : 'video' as const,
      url: URL.createObjectURL(file),
      thumbnailUrl: URL.createObjectURL(file),
      createdAt: new Date().toISOString().split('T')[0],
      size: formatFileSize(file.size)
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const createFolder = async (name: string, parentId?: string) => {
    // Demo implementation
    console.log('Demo: Creating folder:', name, 'in parent:', parentId);
    
    const newFolder = {
      id: `folder-${Date.now()}`,
      name,
      parentId,
      fileCount: 0
    };
    
    setFolders(prev => [...prev, newFolder]);
  };

  const deleteFolder = async (folderId: string) => {
    // Demo implementation
    console.log('Demo: Deleting folder:', folderId);
    setFolders(prev => prev.filter(f => f.id !== folderId));
  };

  const renameFolder = async (folderId: string, newName: string) => {
    // Demo implementation
    console.log('Demo: Renaming folder:', folderId, 'to:', newName);
    setFolders(prev => prev.map(f => 
      f.id === folderId ? { ...f, name: newName } : f
    ));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const value = {
    files,
    folders,
    currentFolder,
    loading,
    setCurrentFolder,
    uploadFiles,
    createFolder,
    deleteFolder,
    renameFolder,
  };

  return (
    <DriveContext.Provider value={value}>
      {children}
    </DriveContext.Provider>
  );
}
