import React, { useState } from 'react';
import { ConfigForm } from './components/ConfigForm';
import { SlidePreview } from './components/SlidePreview';
import { SlideEditor } from './components/SlideEditor';
import { PresentationList } from './components/PresentationList';
import { Presentation as PresentationIcon, Plus, ArrowLeft, Presentation, FileText, Globe, MessageSquare } from 'lucide-react';
import type { PresentationConfig, Slide } from './types';
import { AIService } from './services/ai';
import { exportToPowerPoint } from './utils/export';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const aiService = new AIService(apiKey);
const STORAGE_KEY = 'ai_presentations';

function App() {
  const [presentations, setPresentations] = React.useState<Presentation[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentPresentation, setCurrentPresentation] = React.useState<Presentation | null>(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [editingSlide, setEditingSlide] = React.useState<Slide | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [showNewForm, setShowNewForm] = React.useState(presentations.length === 0);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations));
  }, [presentations]);

  const handleConfigSubmit = async (config: PresentationConfig) => {
    setLoading(true);
    setError(null);

    try {
      if (!apiKey) throw new Error('API key is not configured');

      const content = await aiService.generatePresentation(
        config.topic,
        config.purpose,
        config.audience,
        config.keyPoints,
        config.slideCount
      );

      const slides: Slide[] = await Promise.all(content.slides.map(async (slide, index) => {
        let imageUrl = '';
        try {
          imageUrl = await aiService.generateImage(slide.imagePrompt || slide.title, {
            model: config.imageSource
          });
        } catch (err) {
          console.error('Error generating image:', err);
        }

        return {
          id: `slide-${index}`,
          title: slide.title,
          content: slide.content,
          notes: slide.notes,
          imageUrl,
          imagePrompt: slide.imagePrompt,
          sources: slide.sources,
          generatedAt: new Date()
        };
      }));

      const newPresentation: Presentation = {
        id: `presentation-${Date.now()}`,
        config,
        slides,
        references: content.references,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setPresentations(prev => [...prev, newPresentation]);
      setCurrentPresentation(newPresentation);
      setShowNewForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate presentation');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {!currentPresentation && !showNewForm ? (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Generate</h1>
            <p className="text-xl text-gray-600">What would you like to create today?</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
            <button
              onClick={() => setShowNewForm(true)}
              className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-purple-200 hover:border-purple-400"
            >
              <Presentation className="w-8 h-8 text-purple-600 mb-2" />
              <span className="text-gray-900 font-medium">Presentation</span>
            </button>
            <button className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm opacity-50 cursor-not-allowed">
              <Globe className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600">Webpage</span>
            </button>
            <button className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm opacity-50 cursor-not-allowed">
              <FileText className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600">Document</span>
            </button>
            <button className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm opacity-50 cursor-not-allowed">
              <MessageSquare className="w-8 h-8 text-gray-400 mb-2" />
              <span className="text-gray-600">Social</span>
              <span className="text-xs text-purple-600 font-medium mt-1">BETA</span>
            </button>
          </div>

          {presentations.length > 0 && (
            <PresentationList
              presentations={presentations}
              onSelect={setCurrentPresentation}
              onDelete={(id) => {
                setPresentations(prev => prev.filter(p => p.id !== id));
              }}
              onExport={exportToPowerPoint}
            />
          )}
        </div>
      ) : (
        <div className="min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {(currentPresentation || showNewForm) && (
                    <button
                      onClick={() => {
                        setCurrentPresentation(null);
                        setShowNewForm(false);
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                  <div className="flex items-center space-x-2">
                    <PresentationIcon className="w-8 h-8 text-purple-600" />
                    <h1 className="text-xl font-semibold text-gray-900">
                      {currentPresentation ? currentPresentation.config.topic : 'New Presentation'}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            {showNewForm ? (
              <div className="relative">
                <ConfigForm onSubmit={handleConfigSubmit} />
                {loading && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                      <p className="mt-4 text-gray-600">Generating your presentation...</p>
                    </div>
                  </div>
                )}
              </div>
            ) : currentPresentation ? (
              <div className="space-y-8">
                <SlidePreview
                  slides={currentPresentation.slides}
                  currentSlide={currentSlide}
                  theme={currentPresentation.config.style}
                  onNavigate={setCurrentSlide}
                  onEdit={setEditingSlide}
                  onExport={() => exportToPowerPoint(currentPresentation)}
                />
              </div>
            ) : null}
          </main>
        </div>
      )}

      {editingSlide && (
        <SlideEditor
          slide={editingSlide}
          onSave={(updatedSlide) => {
            if (!currentPresentation) return;
            const updatedPresentation = {
              ...currentPresentation,
              slides: currentPresentation.slides.map(slide =>
                slide.id === updatedSlide.id ? updatedSlide : slide
              ),
              updatedAt: new Date()
            };
            setCurrentPresentation(updatedPresentation);
            setPresentations(prev =>
              prev.map(p => p.id === updatedPresentation.id ? updatedPresentation : p)
            );
            setEditingSlide(null);
          }}
          onClose={() => setEditingSlide(null)}
        />
      )}
    </div>
  );
}

export default App;
// import React, { useState } from 'react';
// import { ConfigForm } from './components/ConfigForm';
// import { SlidePreview } from './components/SlidePreview';
// import { SlideEditor } from './components/SlideEditor';
// import { PresentationList } from './components/PresentationList';
// import { Presentation as PresentationIcon, Plus, ArrowLeft, Presentation, FileText, Globe, MessageSquare } from 'lucide-react';
// import type { PresentationConfig, Slide } from './types';
// import { AIService } from './services/ai';
// import { exportToPowerPoint } from './utils/export';

// const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// const aiService = new AIService(apiKey);
// const STORAGE_KEY = 'ai_presentations';

// function App() {
//   const [presentations, setPresentations] = React.useState<Presentation[]>(() => {
//     const saved = localStorage.getItem(STORAGE_KEY);
//     return saved ? JSON.parse(saved) : [];
//   });
  
//   const [currentPresentation, setCurrentPresentation] = React.useState<Presentation | null>(null);
//   const [currentSlide, setCurrentSlide] = React.useState(0);
//   const [editingSlide, setEditingSlide] = React.useState<Slide | null>(null);
//   const [loading, setLoading] = React.useState(false);
//   const [error, setError] = React.useState<string | null>(null);
//   const [showNewForm, setShowNewForm] = React.useState(presentations.length === 0);

//   React.useEffect(() => {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(presentations));
//   }, [presentations]);

//   const handleAddSlide = () => {
//     if (!currentPresentation) return;

//     const newSlide: Slide = {
//       id: `slide-${Date.now()}`,
//       title: 'New Slide',
//       content: 'Add your content here',
//       notes: 'Speaker notes',
//       generatedAt: new Date()
//     };

//     const updatedPresentation = {
//       ...currentPresentation,
//       slides: [...currentPresentation.slides, newSlide],
//       updatedAt: new Date()
//     };

//     setCurrentPresentation(updatedPresentation);
//     setPresentations(prev =>
//       prev.map(p => p.id === updatedPresentation.id ? updatedPresentation : p)
//     );
//     setCurrentSlide(updatedPresentation.slides.length - 1);
//     setEditingSlide(newSlide);
//   };

//   const handleConfigSubmit = async (config: PresentationConfig) => {
//     setLoading(true);
//     setError(null);

//     try {
//       if (!apiKey) throw new Error('API key is not configured');

//       const content = await aiService.generatePresentation(
//         config.topic,
//         config.purpose,
//         config.audience,
//         config.keyPoints,
//         config.slideCount
//       );

//       const slides: Slide[] = await Promise.all(content.slides.map(async (slide, index) => {
//         let imageUrl = '';
//         try {
//           imageUrl = await aiService.generateImage(slide.imagePrompt || slide.title, {
//             model: config.imageSource
//           });
//         } catch (err) {
//           console.error('Error generating image:', err);
//         }

//         return {
//           id: `slide-${index}`,
//           title: slide.title,
//           content: slide.content,
//           notes: slide.notes,
//           imageUrl,
//           imagePrompt: slide.imagePrompt,
//           sources: slide.sources,
//           generatedAt: new Date()
//         };
//       }));

//       const newPresentation: Presentation = {
//         id: `presentation-${Date.now()}`,
//         config,
//         slides,
//         references: content.references,
//         createdAt: new Date(),
//         updatedAt: new Date()
//       };

//       setPresentations(prev => [...prev, newPresentation]);
//       setCurrentPresentation(newPresentation);
//       setShowNewForm(false);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to generate presentation');
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
//       {!currentPresentation && !showNewForm ? (
//         <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">Generate</h1>
//             <p className="text-xl text-gray-600">What would you like to create today?</p>
//           </div>

//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-12">
//             <button
//               onClick={() => setShowNewForm(true)}
//               className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all border-2 border-purple-200 hover:border-purple-400"
//             >
//               <Presentation className="w-8 h-8 text-purple-600 mb-2" />
//               <span className="text-gray-900 font-medium">Presentation</span>
//             </button>
//             <button className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm opacity-50 cursor-not-allowed">
//               <Globe className="w-8 h-8 text-gray-400 mb-2" />
//               <span className="text-gray-600">Webpage</span>
//             </button>
//             <button className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm opacity-50 cursor-not-allowed">
//               <FileText className="w-8 h-8 text-gray-400 mb-2" />
//               <span className="text-gray-600">Document</span>
//             </button>
//             <button className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm opacity-50 cursor-not-allowed">
//               <MessageSquare className="w-8 h-8 text-gray-400 mb-2" />
//               <span className="text-gray-600">Social</span>
//               <span className="text-xs text-purple-600 font-medium mt-1">BETA</span>
//             </button>
//           </div>

//           {presentations.length > 0 && (
//             <PresentationList
//               presentations={presentations}
//               onSelect={setCurrentPresentation}
//               onDelete={(id) => {
//                 setPresentations(prev => prev.filter(p => p.id !== id));
//               }}
//               onExport={exportToPowerPoint}
//             />
//           )}
//         </div>
//       ) : (
//         <div className="min-h-screen">
//           <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
//             <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
//               <div className="flex items-center justify-between">
//                 <div className="flex items-center space-x-3">
//                   {(currentPresentation || showNewForm) && (
//                     <button
//                       onClick={() => {
//                         setCurrentPresentation(null);
//                         setShowNewForm(false);
//                       }}
//                       className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                     >
//                       <ArrowLeft className="w-5 h-5 text-gray-600" />
//                     </button>
//                   )}
//                   <div className="flex items-center space-x-2">
//                     <PresentationIcon className="w-8 h-8 text-purple-600" />
//                     <h1 className="text-xl font-semibold text-gray-900">
//                       {currentPresentation ? currentPresentation.config.topic : 'New Presentation'}
//                     </h1>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </header>

//           <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//             {error && (
//               <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
//                 {error}
//               </div>
//             )}

//             {showNewForm ? (
//               <div className="relative">
//                 <ConfigForm onSubmit={handleConfigSubmit} />
//                 {loading && (
//                   <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
//                     <div className="flex flex-col items-center">
//                       <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
//                       <p className="mt-4 text-gray-600">Generating your presentation...</p>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             ) : currentPresentation ? (
//               <div className="space-y-8">
//                 <SlidePreview
//                   slides={currentPresentation.slides}
//                   currentSlide={currentSlide}
//                   theme={currentPresentation.config.style}
//                   onNavigate={setCurrentSlide}
//                   onEdit={setEditingSlide}
//                   onExport={() => exportToPowerPoint(currentPresentation)}
//                   onAddSlide={handleAddSlide}
//                 />
//               </div>
//             ) : null}
//           </main>
//         </div>
//       )}

//       {editingSlide && (
//         <SlideEditor
//           slide={editingSlide}
//           onSave={(updatedSlide) => {
//             if (!currentPresentation) return;
//             const updatedPresentation = {
//               ...currentPresentation,
//               slides: currentPresentation.slides.map(slide =>
//                 slide.id === updatedSlide.id ? updatedSlide : slide
//               ),
//               updatedAt: new Date()
//             };
//             setCurrentPresentation(updatedPresentation);
//             setPresentations(prev =>
//               prev.map(p => p.id === updatedPresentation.id ? updatedPresentation : p)
//             );
//             setEditingSlide(null);
//           }}
//           onClose={() => setEditingSlide(null)}
//         />
//       )}
//     </div>
//   );
// }

// export default App;