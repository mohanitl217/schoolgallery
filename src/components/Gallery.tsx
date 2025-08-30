import React, { useState, useEffect } from 'react';
import { Search, Filter, Grid, List, Download, Calendar, FolderOpen, Play } from 'lucide-react';
import { useDrive } from '../contexts/DriveContext';
import { MediaModal } from './MediaModal';
import { FolderBreadcrumbs } from './FolderBreadcrumbs';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  size: string;
}

export function Gallery() {
  const { files, folders, currentFolder, setCurrentFolder, loading } = useDrive();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'images' | 'videos'>('all');

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || file.type === filterType.slice(0, -1);
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <FolderBreadcrumbs currentFolder={currentFolder} onFolderChange={setCurrentFolder} />
      
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search photos and videos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Media</option>
            <option value="images">Photos Only</option>
            <option value="videos">Videos Only</option>
          </select>
          
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-colors duration-200 ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Folders */}
      {folders.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center">
            <FolderOpen size={20} className="mr-2" />
            Folders
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <button
                key={folder.id}
                onClick={() => setCurrentFolder(folder)}
                className="p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 group"
              >
                <div className="flex flex-col items-center space-y-2">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
                    <FolderOpen size={24} className="text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 text-center truncate w-full">
                    {folder.name}
                  </span>
                  <span className="text-xs text-gray-500">{folder.fileCount} items</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Media Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">
            Media ({filteredFiles.length} items)
          </h3>
          {filteredFiles.length > 0 && (
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
              <Download size={16} />
              <span>Download All</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredFiles.length === 0 ? (
          <div className="text-center py-12">
            <Camera size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600">No media found in this folder</p>
            <p className="text-sm text-gray-500 mt-2">Upload some photos or videos to get started</p>
          </div>
        ) : (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4'
              : 'space-y-3'
          }>
            {filteredFiles.map((file) => (
              <MediaCard
                key={file.id}
                file={file}
                viewMode={viewMode}
                onClick={() => setSelectedMedia(file)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedMedia && (
        <MediaModal
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
        />
      )}
    </div>
  );
}

interface MediaCardProps {
  file: MediaFile;
  viewMode: 'grid' | 'list';
  onClick: () => void;
}

function MediaCard({ file, viewMode, onClick }: MediaCardProps) {
  if (viewMode === 'list') {
    return (
      <div
        onClick={onClick}
        className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 cursor-pointer group"
      >
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={file.thumbnailUrl}
            alt={file.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          {file.type === 'video' && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <Play size={20} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 truncate">{file.name}</h4>
          <p className="text-sm text-gray-500">{file.size} • {file.createdAt}</p>
        </div>
        <Download size={20} className="text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className="group relative aspect-square bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-300 cursor-pointer"
    >
      <img
        src={file.thumbnailUrl}
        alt={file.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      
      {file.type === 'video' && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
            <Play size={20} className="text-gray-800 ml-1" />
          </div>
        </div>
      )}
      
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <p className="text-white text-sm font-medium truncate">{file.name}</p>
        <p className="text-white/80 text-xs">{file.size}</p>
      </div>
    </div>
  );
}