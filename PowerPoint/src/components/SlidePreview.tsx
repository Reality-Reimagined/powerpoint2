import React, { useState, useEffect } from 'react';
import type { Slide } from '../types';
import { ChevronLeft, ChevronRight, Edit2, MessageSquare, X, Download, ExternalLink, Grid, Maximize2, Minimize2, Settings2, Plus } from 'lucide-react';
import { THEME_STYLES } from '../services/ai';

interface SlidePreviewProps {
  slides: Slide[];
  currentSlide: number;
  theme: keyof typeof THEME_STYLES;
  onNavigate: (index: number) => void;
  onEdit: (slide: Slide) => void;
  onExport: () => void;
  onAddSlide?: () => void;
}

export function SlidePreview({ slides, currentSlide, theme, onNavigate, onEdit, onExport, onAddSlide }: SlidePreviewProps) {
  const [showNotes, setShowNotes] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previousThumbnailState, setPreviousThumbnailState] = useState(true);
  const slide = slides[currentSlide];
  const styles = THEME_STYLES[theme];

  // Handle keyboard navigation and fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') onNavigate(Math.max(0, currentSlide - 1));
      if (e.key === 'ArrowRight') onNavigate(Math.min(slides.length - 1, currentSlide + 1));
      if (e.key === 'f') toggleFullscreen();
      if (e.key === 'Escape' && isFullscreen) setIsFullscreen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide, slides.length, isFullscreen]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      // Entering fullscreen
      setPreviousThumbnailState(showThumbnails);
      setShowThumbnails(false);
    } else {
      // Exiting fullscreen
      setShowThumbnails(previousThumbnailState);
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleAddSlide = () => {
    if (onAddSlide) {
      onAddSlide();
      // Navigate to the new slide after it's added
      onNavigate(slides.length);
    }
  };

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : ''}`}>
      <div className="flex h-full">
        {/* Thumbnails Sidebar */}
        {showThumbnails && !isFullscreen && (
          <div className="w-64 bg-gray-900 border-r border-gray-800/20 overflow-y-auto h-[calc(100vh-4rem)] flex-shrink-0">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-300">Slides</h3>
                <button
                  onClick={() => setShowThumbnails(false)}
                  className="p-1 text-gray-400 hover:text-gray-200 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-3">
                {slides.map((s, index) => (
                  <button
                    key={s.id}
                    onClick={() => onNavigate(index)}
                    className={`w-full group relative rounded-lg overflow-hidden transition-all ${
                      index === currentSlide
                        ? 'ring-2 ring-purple-500'
                        : 'hover:ring-2 hover:ring-purple-400/50'
                    }`}
                  >
                    <div className={`aspect-video ${styles.background} p-3`}>
                      <div className={`text-xs font-medium ${styles.text} mb-2 truncate`}>
                        {s.title}
                      </div>
                      {s.imageUrl && (
                        <img
                          src={s.imageUrl}
                          alt={s.title}
                          className="w-full h-20 object-cover rounded"
                        />
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>
                    <div className="absolute bottom-2 left-2 text-[10px] font-medium text-gray-400">
                      {index + 1}
                    </div>
                  </button>
                ))}
                <button 
                  onClick={handleAddSlide}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-gray-700 hover:border-purple-500/50 transition-colors flex items-center justify-center text-gray-500 hover:text-purple-400 group"
                >
                  <div className="flex flex-col items-center">
                    <Plus className="w-5 h-5 mb-1" />
                    <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Add Slide
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="bg-gray-900 border-b border-gray-800/20 p-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center space-x-3">
              {!isFullscreen && (
                <button
                  onClick={() => setShowThumbnails(!showThumbnails)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  title="Toggle Thumbnails"
                >
                  <Grid className="w-5 h-5" />
                </button>
              )}
              <span className="text-sm text-gray-300">
                {currentSlide + 1} / {slides.length}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNotes(!showNotes)}
                className={`p-2 rounded-lg hover:bg-gray-800 ${
                  showNotes ? 'text-purple-400' : 'text-gray-400 hover:text-gray-200'
                }`}
                title="Toggle Speaker Notes"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
              {!isFullscreen && (
                <button
                  onClick={() => onEdit(slide)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  title="Edit Slide"
                >
                  <Edit2 className="w-5 h-5" />
                </button>
              )}
              {!isFullscreen && (
                <button
                  onClick={onExport}
                  className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                  title="Export Presentation"
                >
                  <Download className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800"
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-5 h-5" />
                ) : (
                  <Maximize2 className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Main Slide Area */}
            <div className="flex-1 relative">
              {/* Navigation Buttons */}
              <button
                onClick={() => onNavigate(currentSlide - 1)}
                disabled={currentSlide === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-gray-200 hover:text-white hover:bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed z-10 backdrop-blur-sm"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => onNavigate(currentSlide + 1)}
                disabled={currentSlide === slides.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/20 text-gray-200 hover:text-white hover:bg-black/30 disabled:opacity-50 disabled:cursor-not-allowed z-10 backdrop-blur-sm"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Slide Content */}
              <div className={`h-full flex items-center justify-center p-8 ${isFullscreen ? 'p-0' : ''}`}>
                <div className={`relative w-full max-w-5xl aspect-[16/9] rounded-2xl overflow-hidden ${styles.background} shadow-2xl`}>
                  <div className="absolute inset-0 p-12">
                    <h2 className={`text-4xl font-bold mb-8 ${styles.heading}`}>
                      {slide.title}
                    </h2>
                    <div className="flex gap-8">
                      {slide.imageUrl && (
                        <img
                          src={slide.imageUrl}
                          alt={slide.title}
                          className="w-1/2 rounded-xl object-cover"
                        />
                      )}
                      <div className={`${slide.imageUrl ? 'w-1/2' : 'w-full'} space-y-4`}>
                        <div className={`text-xl leading-relaxed ${styles.text}`}>
                          {slide.content}
                        </div>
                        {slide.sources && slide.sources.length > 0 && (
                          <div className="mt-8 text-sm opacity-75">
                            <p className={`font-medium ${styles.text}`}>Sources:</p>
                            <ul className="list-disc list-inside space-y-1">
                              {slide.sources.map((source, i) => (
                                <li key={i} className={styles.text}>{source}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Speaker Notes Panel */}
            {showNotes && (
              <div className={`${isFullscreen ? 'w-60' : 'w-60'} bg-gray-900 border-l border-gray-800/20 overflow-y-auto`}>
                <div className="p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-medium text-gray-300">Speaker Notes</h3>
                    <button
                      onClick={() => setShowNotes(false)}
                      className="p-1 text-gray-400 hover:text-gray-200 rounded-full"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap">{slide.notes}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}