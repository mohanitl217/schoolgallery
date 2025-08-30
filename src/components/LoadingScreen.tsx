import React from 'react';
import { Camera } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 mx-auto animate-pulse">
            <Camera size={24} className="text-white" />
          </div>
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600 mx-auto"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Gallery</h2>
        <p className="text-gray-600">Connecting to Google Drive...</p>
      </div>
    </div>
  );
}