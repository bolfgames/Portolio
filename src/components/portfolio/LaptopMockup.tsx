import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import LaptopSlider, { LaptopSliderRef } from './LaptopSlider';
import { useI18n } from '../../contexts/I18nContext';

interface LaptopProject {
  name: string;
  images: string[];
  features?: string[];
  link?: string;
  linkUrl?: string;
}

interface LaptopMockupProps {
  project: LaptopProject;
}

export default function LaptopMockup({ project }: LaptopMockupProps) {
  const { t } = useI18n();
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const mockupRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<LaptopSliderRef>(null);
  
  // Emir için yeşil renk (#2ECC71)
  const accentColor = '#2ECC71';

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      const newPaused = !prev;
      if (newPaused) {
        setResetTimer(prevTimer => prevTimer + 1);
      }
      return newPaused;
    });
  }, []);

  const handleMockupClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    // Click to pause/resume
    e.stopPropagation();
    togglePause();
  }, [togglePause]);

  // Helper function to translate project features
  const translateProjectFeature = (feature: string): string => {
    const featureMap: Record<string, string> = {
      'Level Design': 'portfolio.projectFeatures.levelDesign',
      'Game Design': 'portfolio.projectFeatures.gameDesign',
      'Narrative Design': 'portfolio.projectFeatures.narrativeDesign',
      '3D Level Design': 'portfolio.projectFeatures.3dLevelDesign',
      'Environment Design': 'portfolio.projectFeatures.environmentDesign',
      'FPS gameplay mechanics': 'portfolio.projectFeatures.fpsGameplayMechanics',
      'TPS gameplay mechanics': 'portfolio.projectFeatures.tpsGameplayMechanics',
      'Prototype development': 'portfolio.projectFeatures.prototypeDevelopment',
      'Environment creation': 'portfolio.projectFeatures.environmentCreation',
      'Gameplay mechanics design': 'portfolio.projectFeatures.gameplayMechanicsDesign',
    };
    
    const key = featureMap[feature];
    if (key) {
      try {
        const translated = t(key);
        if (translated && translated !== key) {
          return translated;
        }
      } catch {}
    }
    return feature;
  };

  // Helper function to translate project names
  const translateProjectName = (name: string): string => {
    const nameMap: Record<string, string> = {
      'Black Spot': 'portfolio.projectNames.blackSpot',
      'Gloveffect': 'portfolio.projectNames.gloveffect',
      'TPS Shooter': 'portfolio.projectNames.tpsShooter',
    };
    
    const key = nameMap[name];
    if (key) {
      try {
        const translated = t(key);
        if (translated && translated !== key) {
          return translated;
        }
      } catch {}
    }
    return name;
  };

  // Helper function to translate links
  const translateLink = (link: string): string => {
    const linkMap: Record<string, string> = {
      'Trailer': 'portfolio.links.trailer',
      'Gameplay Trailer': 'portfolio.links.gameplayTrailer',
    };
    
    const key = linkMap[link];
    if (key) {
      try {
        const translated = t(key);
        if (translated && translated !== key) {
          return translated;
        }
      } catch {}
    }
    return link;
  };

  if (!project || project.images.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mb-16">
      {/* Project Name - Outside Mockup */}
      <motion.h3
        key={project.name}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl md:text-2xl font-bold text-bolf-white text-center mb-[-20px]"
      >
        {translateProjectName(project.name)}
      </motion.h3>

      {/* Laptop Mockup Container */}
      <div className="relative flex items-center justify-center w-full" ref={mockupRef} style={{ minHeight: '400px' }}>
        {/* Laptop Mockup */}
        <div
          className="relative"
          style={{
            padding: '4% 6%',
            margin: '0 auto',
            maxWidth: '800px',
            width: '100%',
            minHeight: '300px',
          }}
          onClick={handleMockupClick}
        >
          {/* Screen */}
          <div
            className="relative"
            style={{
              background: '#000',
              borderRadius: '3% 3% 0.5% 0.5% / 5%',
              margin: '0 auto',
              position: 'relative',
              width: '90%',
            }}
          >
            {/* Screen border - aspect ratio container */}
            <div
              className="relative"
              style={{
                border: '2px solid #cacacc',
                borderRadius: '3% 3% 0.5% 0.5% / 5%',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.8) inset, 0 0 1px 2px rgba(255, 255, 255, 0.3) inset',
                paddingTop: '57%',
              }}
            >
              {/* Viewport - absolute positioned inside screen border */}
              <div
                className="absolute overflow-hidden"
                style={{
                  top: '4.3%',
                  left: '3.2%',
                  right: '3.2%',
                  bottom: '4.3%',
                  background: '#333',
                  borderRadius: '2% 2% 0.3% 0.3% / 4%',
                  width: '93.6%',
                  height: '91.4%',
                }}
              >
                <LaptopSlider
                  ref={sliderRef}
                  key={`${project.name}-${resetTimer}`}
                  images={project.images}
                  projectName={project.name}
                  isPaused={isPaused}
                  resetTimer={resetTimer}
                  showIndicators={true}
                  accentColor={accentColor}
                />
              </div>

              {/* Bottom border effect */}
              <div
                className="absolute bottom-0 left-0 right-0"
                style={{
                  height: '1px',
                  borderTop: '2px solid rgba(255, 255, 255, 0.15)',
                  bottom: '0.75%',
                  left: '0.5%',
                  width: '99%',
                }}
              />
            </div>

            {/* Pause/Resume Button - Inside Screen, Top Right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePause();
              }}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-bolf-black/70 hover:bg-bolf-black/90 border border-bolf-gray/30 transition-all group"
              style={{ borderColor: accentColor + '40' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = accentColor + '40'; }}
              aria-label={isPaused ? t('portfolio.clickToResume') : t('portfolio.clickToPause')}
            >
              {isPaused ? (
                <svg
                  className="w-5 h-5 transition-colors"
                  style={{ color: accentColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 transition-colors"
                  style={{ color: accentColor }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>

          {/* Pause Indicator */}
          {isPaused && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-bolf-black/80 text-bolf-white px-4 py-2 rounded-lg text-sm"
            >
              {t('portfolio.paused')}
            </motion.div>
          )}
        </div>

        {/* Navigation Buttons - Outside Mockup */}
        {project.images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sliderRef.current?.handlePrevious();
              }}
              className="absolute left-[220px] top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-bolf-black/70 hover:bg-bolf-black/90 border border-bolf-gray/30 transition-all group"
              style={{ borderColor: accentColor + '40' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = accentColor + '40'; }}
              aria-label="Previous image"
            >
              <svg
                className="w-6 h-6 transition-colors"
                style={{ color: accentColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                sliderRef.current?.handleNext();
              }}
              className="absolute right-[220px] top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-bolf-black/70 hover:bg-bolf-black/90 border border-bolf-gray/30 transition-all group"
              style={{ borderColor: accentColor + '40' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = accentColor + '40'; }}
              aria-label="Next image"
            >
              <svg
                className="w-6 h-6 transition-colors"
                style={{ color: accentColor }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Project Details */}
      <motion.div
        key={`details-${project.name}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mt-0 w-full max-w-[560px] mx-auto"
      >
        {project.features && project.features.length > 0 && (
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-bolf-white mb-3">{t('portfolio.features')}</h4>
            <ul className="list-disc list-inside space-y-2 text-bolf-gray">
              {project.features.map((feature, index) => (
                <li key={index}>{translateProjectFeature(feature)}</li>
              ))}
            </ul>
          </div>
        )}

        {project.link && project.linkUrl && (
          <div className="mt-4">
            <a
              href={project.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
              style={{ color: accentColor }}
            >
              <span>{translateLink(project.link)}</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )}
      </motion.div>
    </div>
  );
}
