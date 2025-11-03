import { useEffect, useRef, useState } from 'react';
import { settingsService } from '../../services/settingsService';

/**
 * TubesCursor Component - WebGL/WebGPU cursor effect
 * Follows Single Responsibility Principle
 */
function TubesCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<any>(null);
  const [cursorSettings, setCursorSettings] = useState(() => 
    settingsService.getTubesCursorSettings()
  );

  useEffect(() => {
    // Load TubesCursor library dynamically
    const loadTubesCursor = async () => {
      if (!canvasRef.current) return;

      try {
        const canvas = canvasRef.current;

        // CRITICAL: Set canvas dimensions to viewport size (not page scroll height)
        // WebGPU has texture size limits (typically 8192x8192)
        // We must use viewport dimensions, not document height
        const maxWidth = Math.min(window.innerWidth, 4096);
        const maxHeight = Math.min(window.innerHeight, 4096);
        
        // Set actual canvas pixel dimensions (not CSS)
        canvas.width = maxWidth;
        canvas.height = maxHeight;

        // Dynamic import from CDN (ES module) - works like the original code
        const module = await import('https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js');
        
        // Get TubesCursor - try default export first, then the module itself
        const TubesCursorClass = module.default || module;
        
        if (!TubesCursorClass || typeof TubesCursorClass !== 'function') {
          console.error('TubesCursor is not a function. Module:', module);
          return;
        }

        // Initialize TubesCursor (passing canvas element and config)
        const app = TubesCursorClass(canvas, {
          tubes: {
            colors: cursorSettings.colors,
            lights: {
              intensity: cursorSettings.lights.intensity,
              colors: cursorSettings.lights.colors,
            },
          },
        });

        if (!app) {
          console.error('TubesCursor returned null/undefined');
          return;
        }

        appRef.current = app;
        
        // CRITICAL: Force canvas size to viewport size AFTER TubesCursor initialization
        // TubesCursor may try to set canvas size to document height, which causes WebGPU errors
        const finalWidth = Math.min(window.innerWidth, 4096);
        const finalHeight = Math.min(window.innerHeight, 4096);
        canvas.width = finalWidth;
        canvas.height = finalHeight;
        
        console.log('TubesCursor initialized successfully', app);
        console.log(`Canvas size forced to: ${canvas.width}x${canvas.height} (viewport: ${window.innerWidth}x${window.innerHeight})`);
        
        // Monitor canvas size changes (TubesCursor might try to resize it)
        const sizeMonitor = setInterval(() => {
          if (!canvasRef.current) {
            clearInterval(sizeMonitor);
            return;
          }
          const currentCanvas = canvasRef.current;
          const expectedWidth = Math.min(window.innerWidth, 4096);
          const expectedHeight = Math.min(window.innerHeight, 4096);
          
          // If canvas size is larger than viewport, force it back
          if (currentCanvas.width > expectedWidth || currentCanvas.height > expectedHeight) {
            console.warn(`Canvas size was changed to ${currentCanvas.width}x${currentCanvas.height}, forcing back to ${expectedWidth}x${expectedHeight}`);
            currentCanvas.width = expectedWidth;
            currentCanvas.height = expectedHeight;
          }
        }, 1000); // Check every second
        
        // Store interval ID for cleanup
        (appRef.current as any).__sizeMonitor = sizeMonitor;
      } catch (error) {
        console.error('Failed to load or initialize TubesCursor:', error);
        console.error('Error details:', error);
      }
    };

    // Small delay to ensure canvas is mounted
    const timer = setTimeout(() => {
      loadTubesCursor();
    }, 100);

    // Handle window resize - update canvas size
    const handleResize = () => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      const maxWidth = Math.min(window.innerWidth, 4096);
      const maxHeight = Math.min(window.innerHeight, 4096);
      canvas.width = maxWidth;
      canvas.height = maxHeight;
      console.log(`Canvas resized to: ${canvas.width}x${canvas.height}`);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (appRef.current) {
        try {
          // Clear size monitor interval if it exists
          if ((appRef.current as any).__sizeMonitor) {
            clearInterval((appRef.current as any).__sizeMonitor);
          }
          
          // Try to destroy/cleanup if method exists
          if (typeof appRef.current.destroy === 'function') {
            appRef.current.destroy();
          } else if (typeof appRef.current.dispose === 'function') {
            appRef.current.dispose();
          }
        } catch (error) {
          console.error('Error cleaning up TubesCursor:', error);
        }
        appRef.current = null;
      }
    };
  }, []);

  // Listen to settings changes and update cursor
  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      const newSettings = settingsService.getTubesCursorSettings();
      setCursorSettings(newSettings);

      // Update cursor settings if app is initialized
      if (appRef.current) {
        if (appRef.current.tubes) {
          if (appRef.current.tubes.setColors) {
            appRef.current.tubes.setColors(newSettings.colors);
          }
          if (appRef.current.tubes.setLightsColors) {
            appRef.current.tubes.setLightsColors(newSettings.lights.colors);
          }
          if (appRef.current.tubes.setLightsIntensity) {
            appRef.current.tubes.setLightsIntensity(newSettings.lights.intensity);
          }
        }
      }
    });

    return unsubscribe;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="tubes-cursor-canvas"
      className="fixed top-0 right-0 bottom-0 left-0 pointer-events-none overflow-hidden"
      style={{ 
        touchAction: 'none',
        zIndex: 9999,
        width: '100vw',
        height: '100vh',
        display: 'block',
        position: 'fixed',
        top: 0,
        left: 0
      }}
    />
  );
}

/**
 * Wrapper component that checks settings before rendering
 * Listens to settings changes for real-time updates
 */
export default function TubesCursorWrapper() {
  const [isEnabled, setIsEnabled] = useState(() => 
    settingsService.isFeatureEnabled('features.tubesCursor.enabled')
  );

  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      setIsEnabled(settingsService.isFeatureEnabled('features.tubesCursor.enabled'));
    });

    return unsubscribe;
  }, []);

  if (!isEnabled) {
    return null;
  }

  return <TubesCursor />;
}

