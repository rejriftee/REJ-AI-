import React, { useState } from 'react';
import { generateImageFromPrompt } from './services/geminiService';
import Spinner from './components/Spinner';
import ImageModal from './components/ImageModal';
import { ImageIcon, SparklesIcon } from './components/Icons';

export default function App() {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [lastPrompt, setLastPrompt] = useState('');

  const handleGenerate = async () => {
    if (!prompt || isLoading) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    setLastPrompt(prompt);

    try {
      const result = await generateImageFromPrompt(prompt);
      if (result) {
        setGeneratedImages([`data:image/png;base64,${result}`]);
      } else {
        setError('Failed to generate image. The model may not have returned an image.');
      }
    } catch (e: any) {
      setError(`An error occurred: ${e.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-black text-white p-4 sm:p-6 lg:p-8">
      <main className="max-w-6xl mx-auto">
        <header className="text-center my-8">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-yellow-400">REJ AI Image Generator</h1>
          <p className="mt-4 text-lg text-gray-300">Create stunning images from text prompts with Gemini AI.</p>
        </header>

        <div className="w-full max-w-3xl mx-auto p-6 bg-gray-900 rounded-2xl border border-yellow-500/30 shadow-2xl space-y-6">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder='e.g., "A futuristic city with flying cars"'
              className="w-full bg-gray-800 border border-gray-600 rounded-xl py-4 pl-5 pr-12 text-base placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all"
              disabled={isLoading}
              onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleGenerate()}
            />
            <SparklesIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-yellow-500" />
          </div>
          
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt}
            className="w-full h-14 inline-flex items-center justify-center bg-yellow-500 text-black font-bold text-lg rounded-xl shadow-lg shadow-yellow-500/30 hover:bg-yellow-400 hover:shadow-xl hover:shadow-yellow-400/50 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none"
          >
            {isLoading ? 'Generating...' : (generatedImages.length > 0 ? 'Generate Again' : 'Generate Image')}
          </button>
        </div>

        {error && (
          <div className="max-w-3xl mx-auto mt-6">
            <p className="text-center text-red-300 bg-red-500/20 border border-red-500/50 p-3 rounded-lg">{error}</p>
          </div>
        )}

        <div className="mt-12">
          {isLoading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : generatedImages.length > 0 ? (
            <div className="p-4 bg-gray-900/50 rounded-2xl">
              <div className="grid grid-cols-1 gap-6">
                {generatedImages.map((src, index) => (
                  <div 
                    key={index} 
                    className="relative aspect-square bg-black rounded-lg overflow-hidden group cursor-pointer shadow-lg"
                    onClick={() => setModalImage(src)}
                  >
                    <img 
                      src={src} 
                      alt={`Generated image for prompt: ${lastPrompt}`}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105 animate-fade-in"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <ImageIcon className="w-20 h-20 mx-auto" />
              <p className="mt-4 text-lg">Your generated images will appear here.</p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="text-center text-gray-500 py-12 mt-8">
        <p>Created with ❤️ using Gemini AI</p>
      </footer>

      {modalImage && (
        <ImageModal imageUrl={modalImage} onClose={() => setModalImage(null)} />
      )}
    </div>
  );
}