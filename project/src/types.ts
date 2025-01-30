export interface Slide {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  notes?: string;
  sources?: string[];
  imagePrompt?: string;
  generatedAt?: Date;
}

export type ImageModel = 'imagen-3-fast' | 'imagen-3' | 'together-sdxl' | 'unsplash' | 'fal-flux';

export interface PresentationConfig {
  topic: string;
  purpose: 'business' | 'educational' | 'informative';
  audience: string;
  slideCount: number;
  keyPoints: string[];
  style: 'bee-happy' | 'ash' | 'oasis' | 'tranquil' | 'kraft' | 'verdigris';
  contentLength: 'brief' | 'medium' | 'detailed';
  imageSource: ImageModel;
  imagenConfig?: {
    width: number;
    height: number;
    negativePrompt?: string;
    guidanceScale?: number;
    seed?: number;
  };
}

export interface Presentation {
  id: string;
  config: PresentationConfig;
  slides: Slide[];
  references?: string[];
  createdAt: Date;
  updatedAt: Date;
  generationStats?: {
    totalImages: number;
    imagenUsage: number;
    unsplashFallbacks: number;
    processingTime: number;
  };
}

export interface ImageGenerationConfig {
  width?: number;
  height?: number;
  steps?: number;
  seed?: number;
  negativePrompt?: string;
  model?: ImageModel;
  guidanceScale?: number;
  quality?: 'default' | 'hd';
}