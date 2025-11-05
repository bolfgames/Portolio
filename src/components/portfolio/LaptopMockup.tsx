import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import LaptopSlider from './LaptopSlider';
import { useI18n } from '../../contexts/I18nContext';

interface LaptopProject {
  name: string;
  images: string[];
  features?: string[];
  link?: string;
  linkUrl?: string;
}

interface LaptopMockupProps {
  projects: LaptopProject[];
}

export default function LaptopMockup({ projects }: LaptopMockupProps) {
  const { t } = useI18n();
  const [currentProject, setCurrentProject] = useState<LaptopProject | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [resetTimer, setResetTimer] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const mockupRef = useRef<HTMLDivElement>(null);
  
  // Emir için yeşil renk (#2ECC71)
  const accentColor = '#2ECC71';

  useEffect(() => {
    if (projects.length > 0 && !currentProject) {
      setCurrentProject(projects[0]);
      setCurrentIndex(0);
    }
  }, [projects, currentProject]);

  const handleProjectChange = useCallback((project: LaptopProject) => {
    setCurrentProject(project);
    const index = projects.findIndex(p => p.name === project.name);
    if (index !== -1) {
      setCurrentIndex(index);
      setCurrentImageIndex(0); // Reset image index when project changes
    }
  }, [projects]);

  const handlePrevious = useCallback(() => {
    const newIndex = (currentIndex - 1 + projects.length) % projects.length;
    const newProject = projects[newIndex];
    setCurrentIndex(newIndex);
    setCurrentProject(newProject);
    setResetTimer(prev => prev + 1);
  }, [currentIndex, projects]);

  const handleNext = useCallback(() => {
    const newIndex = (currentIndex + 1) % projects.length;
    const newProject = projects[newIndex];
    setCurrentIndex(newIndex);
    setCurrentProject(newProject);
    setResetTimer(prev => prev + 1);
  }, [currentIndex, projects]);

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
    if (!mockupRef.current) return;
    
    const rect = mockupRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    
    // Calculate click zones: left 30%, center 40%, right 30%
    const leftZone = width * 0.3;
    const centerZone = width * 0.7;
    
    if (clickX < leftZone) {
      // Left zone: previous
      e.stopPropagation();
      handlePrevious();
    } else if (clickX > centerZone) {
      // Right zone: next
      e.stopPropagation();
      handleNext();
    } else {
      // Center zone: pause/resume
      e.stopPropagation();
      togglePause();
    }
  }, [handlePrevious, handleNext, togglePause]);

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

  if (projects.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col items-center mb-16">
      {/* Project Name - Outside Mockup */}
      {currentProject && (
        <motion.h3
          key={`${currentProject.name}-${currentIndex}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl md:text-2xl font-bold text-bolf-white text-center mb-6"
        >
          {translateProjectName(currentProject.name)}
        </motion.h3>
      )}

      {/* Laptop Mockup Container */}
      <div className="relative flex items-center justify-center" ref={mockupRef}>
        {/* Previous Arrow */}
        <button
          onClick={handlePrevious}
          className="absolute left-[-60px] top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-bolf-black/70 hover:bg-bolf-black/90 border border-bolf-gray/30 transition-all group"
          style={{ borderColor: accentColor + '40', '--hover-border-color': accentColor } as React.CSSProperties & { '--hover-border-color': string }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = accentColor + '40'; }}
          aria-label={t('portfolio.previous')}
        >
          <svg
            className="w-6 h-6 text-bolf-gray transition-colors"
            style={{ color: accentColor }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            onMouseEnter={(e) => { e.currentTarget.style.color = accentColor; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = accentColor; }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Laptop Mockup */}
        <div
          className="relative"
          style={{
            padding: '4% 6%',
            margin: '0 auto',
            maxWidth: '800px',
            width: '100%',
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
              width: '80%',
            }}
          >
            {/* Screen border - aspect ratio container */}
            <div
              className="relative"
              style={{
                border: '2px solid #cacacc',
                borderRadius: '3% 3% 0.5% 0.5% / 5%',
                boxShadow: '0 0 0 1px rgba(0, 0, 0, 0.8) inset, 0 0 1px 2px rgba(255, 255, 255, 0.3) inset',
                paddingTop: '67%',
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
                }}
              >
                <LaptopSlider
                  key={`${currentProject?.name}-${currentIndex}-${resetTimer}`}
                  projects={projects}
                  currentIndex={currentIndex}
                  onProjectChange={handleProjectChange}
                  onIndexChange={(index) => {
                    setCurrentIndex(index);
                    setCurrentImageIndex(0);
                  }}
                  onImageIndexChange={setCurrentImageIndex}
                  isPaused={isPaused}
                  resetTimer={resetTimer}
                  showIndicators={false}
                />
                
                {/* Slider Indicator - Inside Viewport */}
                {currentProject && currentProject.images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {currentProject.images.map((_, index) => (
                      <div
                        key={index}
                        className="rounded-full transition-all"
                        style={{
                          height: '8px',
                          width: index === currentImageIndex ? '24px' : '8px',
                          backgroundColor: index === currentImageIndex ? accentColor : 'rgba(204, 204, 204, 0.5)',
                        }}
                      />
                    ))}
                  </div>
                )}
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
          </div>

          {/* Notch */}
          <div
            className="relative"
            style={{
              background: '#ddd',
              borderRadius: '0 0 7% 7% / 0 0 95% 95%',
              boxShadow: '-5px -1px 3px rgba(0, 0, 0, 0.2) inset, 5px -1px 3px rgba(0, 0, 0, 0.2) inset',
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: '-3.5%',
              zIndex: 2,
              position: 'relative',
              width: '14%',
            }}
          >
            <div
              style={{
                paddingTop: '10%',
              }}
            />
          </div>

          {/* Base (Laptop Body) */}
          <div
            className="relative"
            style={{
              position: 'relative',
              width: '100%',
            }}
          >
            {/* Base body */}
            <div
              style={{
                paddingTop: '3.3%',
                background: 'linear-gradient(#eaeced, #edeef0 55%, #fff 55%, #8a8b8f 56%, #999ba0 61%, #4B4B4F 84%, #262627 89%, rgba(0, 0, 0, .01) 98%)',
                borderRadius: '0 0 10% 10%/ 0 0 50% 50%',
              }}
            />
            {/* Base shine effect */}
            <div
              className="absolute top-0 left-0 right-0"
              style={{
                background: 'linear-gradient(90deg, rgba(0, 0, 0, 0.5), rgba(255, 255, 255, 0.8) 0.5%, rgba(0, 0, 0, 0.4) 3.3%, transparent 15%, rgba(255, 255, 255, 0.8) 50%, transparent 85%, rgba(0, 0, 0, 0.4) 96.7%, rgba(255, 255, 255, 0.8) 99.5%, rgba(0, 0, 0, 0.5) 100%)',
                height: '53%',
                position: 'absolute',
                top: 0,
                width: '100%',
              }}
            />
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

        {/* Next Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 z-20 p-2 rounded-full bg-bolf-black/70 hover:bg-bolf-black/90 border border-bolf-gray/30 transition-all group"
          style={{ borderColor: accentColor + '40' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = accentColor; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = accentColor + '40'; }}
          aria-label={t('portfolio.next')}
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

        {/* Pause/Resume Button */}
        <button
          onClick={togglePause}
          className="absolute top-4 left-4 z-20 p-2 rounded-full bg-bolf-black/70 hover:bg-bolf-black/90 border border-bolf-gray/30 transition-all group"
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

      {/* Project Details */}
      {currentProject && (
        <motion.div
          key={`details-${currentProject.name}-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mt-8 max-w-3xl w-full"
        >
          {currentProject.features && currentProject.features.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-bolf-white mb-3">{t('portfolio.features')}</h4>
              <ul className="list-disc list-inside space-y-2 text-bolf-gray">
                {currentProject.features.map((feature, index) => (
                  <li key={index}>{translateProjectFeature(feature)}</li>
                ))}
              </ul>
            </div>
          )}

          {currentProject.link && currentProject.linkUrl && (
            <div className="mt-4">
              <a
                href={currentProject.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 transition-colors hover:opacity-80"
                style={{ color: accentColor }}
              >
                <span>{translateLink(currentProject.link)}</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

