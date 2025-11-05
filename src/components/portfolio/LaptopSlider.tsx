import { useState, useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAssetPath } from '../../utils/assetPath';

interface LaptopSliderProps {
  images: string[];
  projectName: string;
  isPaused?: boolean;
  resetTimer?: number;
  showIndicators?: boolean;
  accentColor?: string;
}

export interface LaptopSliderRef {
  handlePrevious: () => void;
  handleNext: () => void;
}

const LaptopSlider = forwardRef<LaptopSliderRef, LaptopSliderProps>(({ 
  images,
  projectName,
  isPaused: externalPaused,
  resetTimer,
  showIndicators = true,
  accentColor = '#00BFFF'
}, ref) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(externalPaused ?? false);
  const [imageLoading, setImageLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  // Sync with external pause state
  useEffect(() => {
    if (externalPaused !== undefined && externalPaused !== isPaused) {
      setIsPaused(externalPaused);
    }
  }, [externalPaused, isPaused]);

  // Handle timer reset
  useEffect(() => {
    if (resetTimer !== undefined && resetTimer > 0) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [resetTimer]);

  // Auto-advance images every 3 seconds (loop)
  useEffect(() => {
    if (images.length === 0) return;
    if (images.length === 1) return; // Don't loop if only one image
    if (isPaused) return;
    if (imageLoading) return; // Wait for image to load

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prev) => {
        const nextIndex = (prev + 1) % images.length;
        setImageLoading(true); // Show loading when changing image
        return nextIndex;
      });
    }, 3000); // 3 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [images.length, isPaused, imageLoading]);

  // Handle previous image
  const handlePrevious = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const newIndex = (prev - 1 + images.length) % images.length;
      setImageLoading(true);
      return newIndex;
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [images.length]);

  // Handle next image
  const handleNext = useCallback(() => {
    setCurrentImageIndex((prev) => {
      const newIndex = (prev + 1) % images.length;
      setImageLoading(true);
      return newIndex;
    });
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, [images.length]);

  // Expose handlers via ref
  useImperativeHandle(ref, () => ({
    handlePrevious,
    handleNext
  }), [handlePrevious, handleNext]);

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="800" height="600"%3E%3Crect fill="%23222" width="800" height="600"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="20" fill="%23999" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E';
    setImageLoading(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (images.length === 0) {
    return null;
  }

  const currentImage = images[currentImageIndex];
  const imagePath = getAssetPath(`assets/resumes/Emir/project_images/${currentImage}`);

  return (
    <div className="relative w-full h-full flex flex-col" style={{ width: '100%', height: '100%' }}>
      {/* Image Container */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden" style={{ width: '100%', height: '100%' }}>
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-0">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: accentColor, borderTopColor: 'transparent' }} />
          </div>
        )}
        <AnimatePresence mode="wait">
          <motion.img
            ref={imageRef}
            key={`${projectName}-${currentImageIndex}-${currentImage}`}
            src={imagePath}
            alt={`${projectName} - ${currentImageIndex + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: imageLoading ? 0 : 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="object-contain rounded-lg w-full h-full"
            loading="lazy"
            decoding="async"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </AnimatePresence>
      </div>

      {/* Slider Indicator - at bottom */}
      {showIndicators && images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              className="rounded-full transition-all"
              style={{
                height: '8px',
                width: index === currentImageIndex ? '24px' : '8px',
                backgroundColor: index === currentImageIndex ? accentColor : 'rgba(204, 204, 204, 0.5)',
              }}
              onClick={() => {
                setCurrentImageIndex(index);
                setImageLoading(true);
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
});

LaptopSlider.displayName = 'LaptopSlider';

export default LaptopSlider;
