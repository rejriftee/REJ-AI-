import React, { useEffect } from 'react';
import { XMarkIcon } from './Icons';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative max-w-4xl max-h-[90vh] bg-gray-900 p-4 rounded-xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img src={imageUrl} alt="Enlarged view" className="w-full h-full object-contain rounded-lg" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 w-10 h-10 bg-yellow-500 text-black rounded-full flex items-center justify-center hover:bg-yellow-400 transition-all shadow-lg"
          aria-label="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default ImageModal;