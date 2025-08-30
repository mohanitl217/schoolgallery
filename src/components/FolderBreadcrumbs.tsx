import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface Folder {
  id: string;
  name: string;
  parentId?: string;
}

interface FolderBreadcrumbsProps {
  currentFolder: Folder | null;
  onFolderChange: (folder: Folder | null) => void;
}

export function FolderBreadcrumbs({ currentFolder, onFolderChange }: FolderBreadcrumbsProps) {
  // Mock breadcrumb path - in real implementation, this would be calculated from the folder hierarchy
  const breadcrumbs = currentFolder 
    ? [
        { id: 'root', name: 'Home' },
        { id: '2024', name: '2024' },
        { id: 'sports-day', name: 'Sports Day' },
        currentFolder
      ]
    : [{ id: 'root', name: 'Home' }];

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200">
      <button
        onClick={() => onFolderChange(null)}
        className="flex items-center space-x-1 hover:text-blue-600 transition-colors duration-200"
      >
        <Home size={16} />
        <span>Home</span>
      </button>
      
      {breadcrumbs.length > 1 && (
        <>
          {breadcrumbs.slice(1).map((folder, index) => (
            <React.Fragment key={folder.id}>
              <ChevronRight size={16} className="text-gray-400" />
              <button
                onClick={() => onFolderChange(folder)}
                className={`hover:text-blue-600 transition-colors duration-200 ${
                  index === breadcrumbs.length - 2 ? 'font-medium text-gray-800' : ''
                }`}
              >
                {folder.name}
              </button>
            </React.Fragment>
          ))}
        </>
      )}
    </nav>
  );
}