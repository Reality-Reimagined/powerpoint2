import React from 'react';
import type { Presentation } from '../types';
import { Folder, Clock, Image as ImageIcon, Download, Trash2 } from 'lucide-react';

interface PresentationListProps {
  presentations: Presentation[];
  onSelect: (presentation: Presentation) => void;
  onDelete: (id: string) => void;
  onExport: (presentation: Presentation) => void;
}

export function PresentationList({ presentations, onSelect, onDelete, onExport }: PresentationListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Your Presentations</h2>
      
      {presentations.length === 0 ? (
        <div className="text-center py-8">
          <Folder className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No presentations yet. Create your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presentations.map((presentation) => (
            <div
              key={presentation.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                    {presentation.config.topic}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onExport(presentation)}
                      className="p-1 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
                      title="Export to PowerPoint"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(presentation.id)}
                      className="p-1 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100"
                      title="Delete presentation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  <span>
                    {new Date(presentation.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="mx-2">•</span>
                  <ImageIcon className="w-4 h-4 mr-1" />
                  <span>{presentation.slides.length} slides</span>
                </div>

                <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {presentation.slides[0]?.content || 'No content available'}
                </div>

                <button
                  onClick={() => onSelect(presentation)}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Open Presentation
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}