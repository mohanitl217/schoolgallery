import React from 'react';
import { X, Download, Share2, Info, Calendar, FileText } from 'lucide-react';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  createdAt: string;
  size: string;
}

interface MediaModalProps {
  media: MediaFile;
  onClose: () => void;
}

export function MediaModal({ media, onClose }: MediaModalProps) {
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = media.url;
    link.download = media.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: media.name,
          url: media.url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(media.url);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl max-h-[90vh] w-full overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 truncate flex-1 mr-4">
            {media.name}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title="Share"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title="Download"
            >
              <Download size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Media Content */}
          <div className="flex-1 bg-gray-900 flex items-center justify-center relative">
            {media.type === 'image' ? (
              <img
                src={media.url}
                alt={media.name}
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <video
                src={media.url}
                controls
                className="max-w-full max-h-full"
                autoPlay
              />
            )}
          </div>

          {/* Info Panel */}
          <div className="lg:w-80 bg-gray-50 p-6 overflow-y-auto">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                {media.type === 'image' ? (
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-green-600" />
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText size={20} className="text-purple-600" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-800">File Details</h4>
                  <p className="text-sm text-gray-600 capitalize">{media.type}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Created</p>
                    <p className="text-sm text-gray-600">{media.createdAt}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Info size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Size</p>
                    <p className="text-sm text-gray-600">{media.size}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText size={16} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">File Name</p>
                    <p className="text-sm text-gray-600 break-all">{media.name}</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
                >
                  <Download size={20} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}