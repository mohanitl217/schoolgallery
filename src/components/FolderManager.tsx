import React, { useState } from 'react';
import { Folder, Plus, Edit, Trash2, Calendar, Users, Image, Video } from 'lucide-react';
import { useDrive } from '../contexts/DriveContext';

interface FolderStats {
  id: string;
  name: string;
  path: string;
  photoCount: number;
  videoCount: number;
  totalSize: string;
  createdAt: string;
  subfolders: number;
}

export function FolderManager() {
  const { folders, createFolder, deleteFolder, renameFolder } = useDrive();
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedOccasion, setSelectedOccasion] = useState('');

  // Mock data for demonstration
  const folderStats: FolderStats[] = [
    {
      id: '1',
      name: 'Sports Day',
      path: '2024/Sports Day',
      photoCount: 127,
      videoCount: 8,
      totalSize: '2.4 GB',
      createdAt: '2024-03-15',
      subfolders: 3
    },
    {
      id: '2',
      name: 'Annual Function',
      path: '2024/Annual Function',
      photoCount: 89,
      videoCount: 12,
      totalSize: '1.8 GB',
      createdAt: '2024-12-20',
      subfolders: 5
    },
    {
      id: '3',
      name: 'Science Fair',
      path: '2025/Science Fair',
      photoCount: 45,
      videoCount: 3,
      totalSize: '890 MB',
      createdAt: '2025-01-10',
      subfolders: 2
    }
  ];

  const years = ['2025', '2024', '2023', '2022'];
  const occasions = [
    'Annual Function', 'Sports Day', 'Science Fair', 'Cultural Program',
    'Graduation Ceremony', 'Teachers Day', 'Independence Day', 'Republic Day'
  ];

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;

    const folderPath = selectedYear && selectedOccasion 
      ? `${selectedYear}/${selectedOccasion}/${newFolderName}`
      : selectedYear 
        ? `${selectedYear}/${newFolderName}`
        : newFolderName;

    try {
      await createFolder(folderPath);
      setNewFolderName('');
      setSelectedYear('');
      setSelectedOccasion('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating folder:', error);
    }
  };

  const handleRename = async (folderId: string) => {
    if (!newName.trim()) return;

    try {
      await renameFolder(folderId, newName);
      setEditingFolder(null);
      setNewName('');
    } catch (error) {
      console.error('Error renaming folder:', error);
    }
  };

  const handleDelete = async (folderId: string) => {
    if (confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
      try {
        await deleteFolder(folderId);
      } catch (error) {
        console.error('Error deleting folder:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Folder Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Folder Management</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus size={20} />
            <span>New Folder</span>
          </button>
        </div>

        {showCreateForm && (
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            <h3 className="font-semibold text-gray-800">Create New Folder</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Year (Optional)</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Occasion (Optional)</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={!selectedYear}
                >
                  <option value="">Select Occasion</option>
                  {occasions.map(occasion => (
                    <option key={occasion} value={occasion}>{occasion}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Folder Name</label>
                <input
                  type="text"
                  placeholder="e.g., Morning Session"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors duration-200"
              >
                Create Folder
              </button>
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>

            {selectedYear && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <strong>Path Preview:</strong> {selectedYear}
                  {selectedOccasion && ` / ${selectedOccasion}`}
                  {newFolderName && ` / ${newFolderName}`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Existing Folders */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Existing Folders</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your photo and video collections</p>
        </div>

        <div className="divide-y divide-gray-200">
          {folderStats.map((folder) => (
            <div key={folder.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Folder size={24} className="text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {editingFolder === folder.id ? (
                      <div className="flex items-center space-x-2 mb-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => e.key === 'Enter' && handleRename(folder.id)}
                          autoFocus
                        />
                        <button
                          onClick={() => handleRename(folder.id)}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFolder(null)}
                          className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <h4 className="text-lg font-semibold text-gray-800 mb-1">{folder.name}</h4>
                    )}
                    
                    <p className="text-sm text-gray-600 mb-3">{folder.path}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Image size={16} className="text-green-600" />
                        <span className="text-gray-600">{folder.photoCount} photos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Video size={16} className="text-purple-600" />
                        <span className="text-gray-600">{folder.videoCount} videos</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Folder size={16} className="text-blue-600" />
                        <span className="text-gray-600">{folder.subfolders} subfolders</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span className="text-gray-600">{folder.createdAt}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 inline-flex items-center px-3 py-1 bg-gray-100 rounded-full">
                      <span className="text-sm font-medium text-gray-700">{folder.totalSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setEditingFolder(folder.id);
                      setNewName(folder.name);
                    }}
                    className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                    title="Rename folder"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(folder.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    title="Delete folder"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Storage Overview</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
            <Image size={32} className="mx-auto text-green-600 mb-2" />
            <p className="text-2xl font-bold text-green-700">1,247</p>
            <p className="text-sm text-green-600">Total Photos</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
            <Video size={32} className="mx-auto text-purple-600 mb-2" />
            <p className="text-2xl font-bold text-purple-700">156</p>
            <p className="text-sm text-purple-600">Total Videos</p>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
            <Folder size={32} className="mx-auto text-blue-600 mb-2" />
            <p className="text-2xl font-bold text-blue-700">24</p>
            <p className="text-sm text-blue-600">Folders</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Storage Used</span>
            <span className="text-sm text-gray-600">8.7 GB / 15 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '58%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}