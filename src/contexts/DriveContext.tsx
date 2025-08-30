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
    // In real implementation, this would call your Google Apps Script endpoint
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });
    
    if (folderId) {
      formData.append('folderId', folderId);
    }

    try {
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      // Reload files after upload
      loadMockData();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const createFolder = async (name: string, parentId?: string) => {
    try {
      const response = await fetch('YOUR_GOOGLE_APPS_SCRIPT_URL/folders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, parentId }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to create folder');
      }

      // Reload folders after creation
      loadMockData();
    } catch (error) {
      console.error('Create folder error:', error);
      throw error;
    }
  };

  const deleteFolder = async (folderId: string) => {
    try {
      const response = await fetch(`YOUR_GOOGLE_APPS_SCRIPT_URL/folders/${folderId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to delete folder');
      }

      // Reload folders after deletion
      loadMockData();
    } catch (error) {
      console.error('Delete folder error:', error);
      throw error;
    }
  };

  const renameFolder = async (folderId: string, newName: string) => {
    try {
      const response = await fetch(`YOUR_GOOGLE_APPS_SCRIPT_URL/folders/${folderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newName }),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to rename folder');
      }

      // Reload folders after rename
      loadMockData();
    } catch (error) {
      console.error('Rename folder error:', error);
      throw error;
    }
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