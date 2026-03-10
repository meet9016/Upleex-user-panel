'use client';

import React, { useState, useRef } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom: React.FC<ImageZoomProps> = ({ src, alt, className = '' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!imageRef.current) return;
    
    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setMousePosition({ x, y });
  };

  return (
    <div className="relative">
      <div
        ref={imageRef}
        className={`relative overflow-hidden ${className}`}
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-contain transition-transform duration-300"
            style={{
              transform: isZoomed ? 'scale(2)' : 'scale(1)',
              transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
            }}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 text-gray-400">
            <ImageOff size={48} strokeWidth={1.5} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">No Image Available</span>
          </div>
        )}
      </div>
      
      {/* Zoom indicator */}
      {isZoomed && src && (
        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
          Hover to zoom
        </div>
      )}
    </div>
  );
};

export default ImageZoom;