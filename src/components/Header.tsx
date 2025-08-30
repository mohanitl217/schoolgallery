import React from 'react';
import { Camera, Upload, FolderTree, LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  activeTab: 'gallery' | 'upload' | 'manage';
  onTabChange: (tab: 'gallery' | 'upload' | 'manage') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'gallery' as const, label: 'Gallery', icon: Camera },
    { id: 'upload' as const, label: 'Upload', icon: Upload },
    { id: 'manage' as const, label: 'Manage', icon: FolderTree },
  ];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              School Gallery
            </h1>
            <nav className="hidden md:flex space-x-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={signOut}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Sign out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200">
          <nav className="flex space-x-1 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`flex-1 flex flex-col items-center space-y-1 py-2 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}