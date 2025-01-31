import { GoogleGenerativeAI } from "@google/generative-ai";
import Together from "together-ai";
import { fal } from "@fal-ai/client";
import type { ImageGenerationConfig, ImageModel } from '../types';

// Types for AI response
interface SlideContent {
  title: string;
  content: string;
  notes: string;
  imagePrompt: string;
  sources?: string[];
}

interface PresentationContent {
  slides: SlideContent[];
  references: string[];
}

interface UnsplashPhoto {
  id: string;
  urls: {
    regular: string;
    small: string;
  };
  alt_description: string;
  user: {
    name: string;
    username: string;
  };
}

export const THEME_STYLES = {
  'bee-happy': {
    background: 'bg-gradient-to-br from-yellow-400 to-amber-600',
    text: 'text-gray-900',
    heading: 'text-gray-900 font-bold',
    accent: 'border-yellow-500',
    sidebar: 'bg-gray-900',
    toolbar: 'bg-gray-900/50',
    pptx: { background: 'FFD700', accent: '1F2937', text: '1F2937' }
  },
  ash: {
    background: 'bg-gradient-to-br from-gray-100 to-gray-300',
    text: 'text-gray-800',
    heading: 'text-gray-900 font-bold',
    accent: 'border-gray-400',
    sidebar: 'bg-gray-800',
    toolbar: 'bg-gray-800/50',
    pptx: { background: 'F3F4F6', accent: '1F2937', text: '1F2937' }
  },
  oasis: {
    background: 'bg-gradient-to-br from-emerald-400 to-teal-600',
    text: 'text-white',
    heading: 'text-white font-bold',
    accent: 'border-emerald-300',
    sidebar: 'bg-teal-900',
    toolbar: 'bg-teal-900/50',
    pptx: { background: '059669', accent: 'F0FDF4', text: 'FFFFFF' }
  },
  tranquil: {
    background: 'bg-gradient-to-br from-blue-400 to-indigo-600',
    text: 'text-white',
    heading: 'text-white font-bold',
    accent: 'border-blue-300',
    sidebar: 'bg-indigo-900',
    toolbar: 'bg-indigo-900/50',
    pptx: { background: '3B82F6', accent: 'EFF6FF', text: 'FFFFFF' }
  },
  kraft: {
    background: 'bg-gradient-to-br from-amber-200 to-amber-400',
    text: 'text-amber-900',
    heading: 'text-amber-900 font-bold',
    accent: 'border-amber-500',
    sidebar: 'bg-amber-900',
    toolbar: 'bg-amber-900/50',
    pptx: { background: 'FDE68A', accent: '92400E', text: '78350F' }
  },
  verdigris: {
    background: 'bg-gradient-to-br from-teal-500 to-emerald-700',
    text: 'text-white',
    heading: 'text-white font-bold',
    accent: 'border-teal-400',
    sidebar: 'bg-teal-900',
    toolbar: 'bg-teal-900/50',
    pptx: { background: '14B8A6', accent: 'F0FDFA', text: 'FFFFFF' }
  },
  midnight: {
    background: 'bg-gradient-to-br from-slate-800 via-blue-900 to-slate-900',
    text: 'text-gray-100',
    heading: 'text-white font-bold',
    accent: 'border-blue-400',
    sidebar: 'bg-slate-900',
    toolbar: 'bg-slate-900/50',
    pptx: { background: '0F172A', accent: 'E2E8F0', text: 'FFFFFF' }
  },
  aurora: {
    background: 'bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500',
    text: 'text-white',
    heading: 'text-white font-bold',
    accent: 'border-purple-300',
    sidebar: 'bg-purple-900',
    toolbar: 'bg-purple-900/50',
    pptx: { background: 'A855F7', accent: 'FAE8FF', text: 'FFFFFF' }
  },
  nature: {
    background: 'bg-gradient-to-br from-lime-500 via-green-500 to-emerald-600',
    text: 'text-white',
    heading: 'text-white font-bold',
    accent: 'border-lime-300',
    sidebar: 'bg-green-900',
    toolbar: 'bg-green-900/50',
    pptx: { background: '22C55E', accent: 'F0FDF4', text: 'FFFFFF' }
  }
};

export class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private together: Together;
  private unsplashAccessKey: string;
  private googleProjectId: string;
  private falApiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not set in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 4096,
      }
    });

    const togetherApiKey = import.meta.env.VITE_TOGETHER_API_KEY;
    if (!togetherApiKey) {
      console.warn('VITE_TOGETHER_API_KEY is not set, image generation will fallback to Unsplash');
    }
    
    this.together = new Together({ auth: togetherApiKey || 'dummy-key' });
    this.unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
    this.googleProjectId = import.meta.env.VITE_GOOGLE_PROJECT_ID;
    this.falApiKey = import.meta.env.VITE_FAL_API_KEY;

    // Configure fal.ai client
    if (this.falApiKey) {
      fal.config({
        credentials: this.falApiKey
      });
    }
  }

  async generatePresentation(topic: string, purpose: string, audience: string, keyPoints: string[], slideCount: number): Promise<PresentationContent> {
    const prompt = `Create a well-researched presentation with exactly ${slideCount} slides on:
    Topic: ${topic}
    Purpose: ${purpose}
    Audience: ${audience}
    Key Points: ${keyPoints.join(', ')}

    IMPORTANT: The presentation MUST have exactly ${slideCount} slides, including the title slide.
    Respond ONLY with a valid JSON object containing comprehensive research and citations.
    The response must be a JSON object with this exact schema:
    {
      "slides": [
        {
          "title": string,
          "content": string,
          "notes": string (include research findings and talking points),
          "imagePrompt": string,
          "sources": string[] (list of relevant sources)
        }
      ],
      "references": string[] (complete list of all sources used)
    }

    Requirements:
    1. Content:
      - First slide is a compelling title slide
      - Each key point gets its own detailed slide
      - Content is concise yet informative
      - Use professional language for ${audience}
      
    2. Research:
      - Include relevant statistics and data
      - Cite reputable sources (academic papers, industry reports, etc.)
      - Add context and background in speaker notes
      
    3. Speaker Notes:
      - Provide detailed talking points
      - Include relevant research findings
      - Add engagement tips and audience interaction points
      - Suggest answers to potential questions
      
    4. Visual Elements:
      - Include descriptive imagePrompt for professional visuals
      - Suggest data visualization where appropriate
      
    5. Sources:
      - Include source citations for each slide
      - Provide a complete reference list`;

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
      
      try {
        return JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Invalid JSON response:', cleanResponse);
        throw new Error('Failed to parse AI response as JSON');
      }
    } catch (error) {
      console.error('Error generating presentation:', error);
      throw error;
    }
  }

  async generateImage(prompt: string, config: ImageGenerationConfig = {}): Promise<string> {
    const model = config.model || 'unsplash';

    try {
      switch (model) {
        case 'imagen-3-fast':
        case 'imagen-3':
          return await this.generateImageWithImagen(prompt, model);
        case 'together-sdxl':
          return await this.generateImageWithTogether(prompt, config);
        case 'fal-flux':
          return await this.generateImageWithFal(prompt);
        case 'unsplash':
        default:
          return await this.getUnsplashImage(prompt);
      }
    } catch (error) {
      console.error(`Error generating image with ${model}:`, error);
      return this.getUnsplashImage(prompt);
    }
  }

  private async generateImageWithFal(prompt: string): Promise<string> {
    if (!this.falApiKey) {
      throw new Error('Fal.ai API key not configured');
    }

    try {
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: `Professional presentation image: ${prompt}`,
          image_size: "square_hd"
        },
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        },
      });

      if (!result.data?.images?.[0]?.url) {
        throw new Error('No image URL in Fal.ai response');
      }

      return result.data.images[0].url;
    } catch (error) {
      console.error('Error generating image with Fal.ai:', error);
      throw error;
    }
  }

  private async generateImageWithImagen(prompt: string, model: 'imagen-3-fast' | 'imagen-3'): Promise<string> {
    if (!this.googleProjectId) {
      throw new Error('Google Project ID not configured');
    }

    const modelVersion = model === 'imagen-3-fast' ? 'imagen-3.0-generate-002' : 'imagen-3.0-generate-001';
    const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${this.googleProjectId}/locations/us-central1/publishers/google/models/${modelVersion}:predict`;
    
    try {
      const accessToken = await this.getGoogleAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{
            prompt: `Professional presentation image: ${prompt}. High quality, clear, well-lit.`,
            sampleCount: 1,
            negativePrompt: "blurry, low quality, distorted, watermark, text, writing",
            seed: Math.floor(Math.random() * 1000000)
          }],
          parameters: {
            sampleCount: 1,
            steps: 30,
            cfgScale: 7.5,
            seed: Math.floor(Math.random() * 1000000)
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Imagen API error response:', errorText);
        throw new Error(`Imagen API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      if (!data?.predictions?.[0]?.bytesBase64Encoded) {
        console.error('Unexpected Imagen API response format:', data);
        throw new Error('Invalid response format from Imagen API');
      }

      return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;

    } catch (error) {
      console.error('Error generating image with Imagen:', error);
      
      // Fallback to Fal.ai if available
      if (this.falApiKey) {
        console.log('Falling back to Fal.ai for image generation');
        return this.generateImageWithFal(prompt);
      }
      
      // Otherwise fallback to Unsplash
      console.log('Falling back to Unsplash for image');
      return this.getUnsplashImage(prompt);
    }
  }

  private async generateImageWithTogether(prompt: string, config: ImageGenerationConfig): Promise<string> {
    const togetherApiKey = import.meta.env.VITE_TOGETHER_API_KEY;
    
    if (!togetherApiKey) {
      throw new Error('Together API key not configured');
    }

    const response = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${togetherApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-xl-base-1.0",
        prompt: `Professional, high quality presentation image: ${prompt}`,
        width: config.width || 1024,
        height: config.height || 1024,
        steps: config.steps || 40,
        n: 1,
        seed: config.seed || Math.floor(Math.random() * 10000),
        response_format: "b64_json"
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Together.ai API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    
    if (!data?.data?.[0]?.b64_json) {
      throw new Error('No image data in response');
    }

    return `data:image/png;base64,${data.data[0].b64_json}`;
  }

  private async getUnsplashImage(prompt: string): Promise<string> {
    if (!this.unsplashAccessKey) {
      throw new Error('Unsplash access key not configured');
    }

    try {
      // First try to search for relevant photos
      const searchResponse = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(prompt)}&per_page=10`,
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        }
      );

      if (!searchResponse.ok) {
        throw new Error(`Unsplash API error: ${searchResponse.status}`);
      }

      const searchData = await searchResponse.json();
      
      if (searchData.results && searchData.results.length > 0) {
        // Randomly select one of the top results
        const randomIndex = Math.floor(Math.random() * Math.min(5, searchData.results.length));
        const photo = searchData.results[randomIndex] as UnsplashPhoto;
        return photo.urls.regular;
      }

      // If no results found, get a random photo
      const randomResponse = await fetch(
        'https://api.unsplash.com/photos/random',
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        }
      );

      if (!randomResponse.ok) {
        throw new Error(`Unsplash API error: ${randomResponse.status}`);
      }

      const randomPhoto = await randomResponse.json() as UnsplashPhoto;
      return randomPhoto.urls.regular;
    } catch (error) {
      console.error('Error fetching from Unsplash:', error);
      // Fallback to a default image if everything fails
      return 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809';
    }
  }

  private async getGoogleAccessToken(): Promise<string> {
    const token = import.meta.env.VITE_GOOGLE_ACCESS_TOKEN;
    if (!token) {
      throw new Error('Google access token not configured');
    }
    return token;
  }
}