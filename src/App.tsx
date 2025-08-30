import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Gallery } from './components/Gallery';
import { Upload } from './components/Upload';
import { FolderManager } from './components/FolderManager';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DriveProvider } from './contexts/DriveContext';
import { LoadingScreen } from './components/LoadingScreen';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload' | 'manage'>('gallery');

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">School Photo Gallery</h1>
          <p className="text-gray-600 mb-8">Sign in with Google to access your school photos</p>
          <button
            onClick={() => window.location.href = 'YOUR_GOOGLE_APPS_SCRIPT_URL'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <DriveProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <Header activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="container mx-auto px-4 py-8">
          {activeTab === 'gallery' && <Gallery />}
          {activeTab === 'upload' && <Upload />}
          {activeTab === 'manage' && <FolderManager />}
        </main>
      </div>
    </DriveProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;