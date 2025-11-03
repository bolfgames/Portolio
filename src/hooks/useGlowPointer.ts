import { useEffect } from 'react';

/**
 * Hook for tracking pointer position and updating CSS custom properties
 * Used for glow effect on cards
 * Follows Single Responsibility Principle
 */
export function useGlowPointer(enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const updateGlowPosition = (e: PointerEvent) => {
      document.documentElement.style.setProperty('--x', e.clientX.toFixed(2));
      document.documentElement.style.setProperty(
        '--xp',
        (e.clientX / window.innerWidth).toFixed(2)
      );
      document.documentElement.style.setProperty('--y', e.clientY.toFixed(2));
      document.documentElement.style.setProperty(
        '--yp',
        (e.clientY / window.innerHeight).toFixed(2)
      );
    };

    document.addEventListener('pointermove', updateGlowPosition);

    return () => {
      document.removeEventListener('pointermove', updateGlowPosition);
    };
  }, [enabled]);
}

