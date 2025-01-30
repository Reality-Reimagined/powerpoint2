import React from 'react';
import { Settings2, Users, Target, Layout, List, Image, AlignLeft, Wand2, Zap } from 'lucide-react';
import type { PresentationConfig, ImageModel } from '../types';
import { THEME_STYLES } from '../services/ai';

interface ConfigFormProps {
  onSubmit: (config: PresentationConfig) => void;
}

interface AIModelOption {
  id: ImageModel;
  name: string;
  description: string;
  icon: React.ReactNode;
  isPro?: boolean;
}

const AI_MODELS: AIModelOption[] = [
  {
    id: 'fal-flux',
    name: 'Fal Flux',
    description: 'Fast, high-quality image generation',
    icon: <Zap className="w-4 h-4 text-yellow-500" />
  },
  {
    id: 'imagen-3-fast',
    name: 'Imagen 3 Fast',
    description: 'High-speed image generation from Google',
    icon: <Wand2 className="w-4 h-4 text-purple-500" />
  },
  {
    id: 'imagen-3',
    name: 'Imagen 3',
    description: 'High-quality image generation from Google',
    icon: <Wand2 className="w-4 h-4 text-blue-500" />,
    isPro: true
  },
  {
    id: 'together-sdxl',
    name: 'Stable Diffusion XL',
    description: 'Versatile open-source image generation',
    icon: <Image className="w-4 h-4 text-green-500" />
  },
  {
    id: 'unsplash',
    name: 'Unsplash',
    description: 'Professional stock photos',
    icon: <Image className="w-4 h-4 text-gray-500" />
  }
];

export function ConfigForm({ onSubmit }: ConfigFormProps) {
  const [config, setConfig] = React.useState<PresentationConfig>({
    topic: '',
    purpose: 'business',
    audience: '',
    slideCount: 8,
    keyPoints: [''],
    style: 'verdigris',
    contentLength: 'medium',
    imageSource: 'imagen-3-fast'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(config);
  };

  const addKeyPoint = () => {
    setConfig(prev => ({
      ...prev,
      keyPoints: [...prev.keyPoints, '']
    }));
  };

  const updateKeyPoint = (index: number, value: string) => {
    setConfig(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.map((point, i) => i === index ? value : point)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Theme Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Themes</h2>
          <div className="grid grid-cols-3 gap-4">
            <ThemeOption
              name="bee-happy"
              label="Bee Happy"
              selected={config.style === 'bee-happy'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'bee-happy' }))}
            />
            <ThemeOption
              name="ash"
              label="Ash"
              selected={config.style === 'ash'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'ash' }))}
            />
            <ThemeOption
              name="oasis"
              label="Oasis"
              selected={config.style === 'oasis'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'oasis' }))}
            />
            <ThemeOption
              name="tranquil"
              label="Tranquil"
              selected={config.style === 'tranquil'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'tranquil' }))}
            />
            <ThemeOption
              name="kraft"
              label="Kraft"
              selected={config.style === 'kraft'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'kraft' }))}
            />
            <ThemeOption
              name="verdigris"
              label="Verdigris"
              selected={config.style === 'verdigris'}
              onClick={() => setConfig(prev => ({ ...prev, style: 'verdigris' }))}
            />
          </div>
        </div>

        {/* Content Configuration */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount of text per card</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.contentLength === 'brief'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, contentLength: 'brief' }))}
                >
                  <AlignLeft className="w-4 h-4 mb-1 mx-auto" />
                  Brief
                </button>
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.contentLength === 'medium'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, contentLength: 'medium' }))}
                >
                  <AlignLeft className="w-4 h-4 mb-1 mx-auto" />
                  Medium
                </button>
                <button
                  type="button"
                  className={`p-2 text-sm rounded-lg border ${
                    config.contentLength === 'detailed'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => setConfig(prev => ({ ...prev, contentLength: 'detailed' }))}
                >
                  <AlignLeft className="w-4 h-4 mb-1 mx-auto" />
                  Detailed
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image Generation Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    className={`p-3 text-sm rounded-lg border ${
                      config.imageSource === model.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:bg-gray-50'
                    } flex items-start space-x-3`}
                    onClick={() => setConfig(prev => ({ ...prev, imageSource: model.id }))}
                  >
                    <div className="mt-0.5">{model.icon}</div>
                    <div className="flex-1 text-left">
                      <div className="font-medium flex items-center">
                        {model.name}
                        {model.isPro && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs font-medium bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded">
                            PRO
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Topic</label>
            <input
              type="text"
              value={config.topic}
              onChange={e => setConfig(prev => ({ ...prev, topic: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter presentation topic"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Purpose</label>
            <select
              value={config.purpose}
              onChange={e => setConfig(prev => ({ ...prev, purpose: e.target.value as any }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="business">Business</option>
              <option value="educational">Educational</option>
              <option value="informative">Informative</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Target Audience</label>
            <input
              type="text"
              value={config.audience}
              onChange={e => setConfig(prev => ({ ...prev, audience: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Who is this presentation for?"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Number of Slides</label>
            <input
              type="number"
              min="1"
              max="50"
              value={config.slideCount}
              onChange={e => setConfig(prev => ({ ...prev, slideCount: parseInt(e.target.value) }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Key Points</label>
            <div className="space-y-2">
              {config.keyPoints.map((point, index) => (
                <input
                  key={index}
                  type="text"
                  value={point}
                  onChange={e => updateKeyPoint(index, e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder={`Key point ${index + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={addKeyPoint}
                className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
              >
                Add Key Point
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Generate ({config.slideCount} cards)
        </button>
      </form>
    </div>
  );
}

interface ThemeOptionProps {
  name: string;
  label: string;
  selected: boolean;
  onClick: () => void;
}

function ThemeOption({ name, label, selected, onClick }: ThemeOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
        selected ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50' : 'border-gray-200'
      }`}
    >
      <div className={`absolute inset-0 ${THEME_STYLES[name].background} p-4`}>
        <div className={`text-lg font-semibold ${THEME_STYLES[name].heading}`}>Title</div>
        <div className={`text-sm ${THEME_STYLES[name].text}`}>Body</div>
      </div>
      <div className="absolute bottom-2 left-2 text-xs font-medium text-gray-600">{label}</div>
      {selected && (
        <div className="absolute top-2 right-2">
          <div className="bg-blue-500 text-white rounded-full p-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      )}
    </button>
  );
}