import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '../../contexts/I18nContext';

/**
 * MilestoneTimeline Component
 * Displays milestone timeline with scroll-based animations
 * Adapted from third-party physic-milestones design with BOLF theme
 */
function MilestoneTimeline() {
  const { t } = useI18n();
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemsRef = useRef<(HTMLLIElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  // Get milestones from translations
  const milestones = t('about.milestones') as Array<{ date: string; description: string }>;

  // Check if milestones is valid array
  if (!Array.isArray(milestones) || milestones.length === 0) {
    return null;
  }

  useEffect(() => {
    const checkVisibility = () => {
      const newVisibleItems = new Set<number>();
      
      itemsRef.current.forEach((item, index) => {
        if (item) {
          const rect = item.getBoundingClientRect();
          const isVisible = 
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth);

          if (isVisible) {
            newVisibleItems.add(index);
          }
        }
      });

      setVisibleItems(newVisibleItems);
    };

    // Initial check
    setTimeout(checkVisibility, 100);

    // Check on scroll
    window.addEventListener('scroll', checkVisibility, { passive: true });
    window.addEventListener('resize', checkVisibility);

    return () => {
      window.removeEventListener('scroll', checkVisibility);
      window.removeEventListener('resize', checkVisibility);
    };
  }, [milestones.length]);

  return (
    <div ref={containerRef} className="timeline py-16 md:py-24 mt-12">
      <div className="container mx-auto px-4">
        <ul className="relative max-w-4xl mx-auto" style={{ listStyle: 'none', padding: 0, margin: '0 auto' }}>
          {/* Timeline vertical line */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-bolf-neon-blue via-bolf-neon-blue to-bolf-orange opacity-60"
            style={{ 
              height: 'calc(100% - 50px)',
              top: '50px',
              bottom: '0',
              zIndex: 1
            }}
          />

          {milestones.map((milestone, index) => {
            const isVisible = visibleItems.has(index);
            const isOdd = index % 2 === 0;

            return (
              <li
                key={index}
                ref={(el) => {
                  itemsRef.current[index] = el;
                }}
                className="relative mb-12 md:mb-16"
                style={{
                  paddingTop: index === 0 ? '50px' : '0',
                  width: '100%',
                  minHeight: '120px'
                }}
              >
                {/* Timeline dot */}
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full z-10"
                  style={{
                    background: 'linear-gradient(135deg, #00BFFF, #FFA500)',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    boxShadow: '0 0 10px rgba(0, 191, 255, 0.5), 0 0 20px rgba(255, 165, 0, 0.3)',
                    top: '50%',
                    marginTop: '-10px'
                  }}
                />

                {/* Content card */}
                <motion.div
                  initial={{ opacity: 0, x: isOdd ? 100 : -100, rotate: isOdd ? 10 : -10 }}
                  animate={isVisible ? { opacity: 1, x: 0, rotate: 0 } : { opacity: 0, x: isOdd ? 100 : -100, rotate: isOdd ? 10 : -10 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className={`absolute top-0 w-full md:w-[400px] ${
                    isOdd 
                      ? 'md:right-auto milestone-card-left' 
                      : 'md:left-auto milestone-card-right'
                  } left-0`}
                  style={{
                    top: 'calc(50% - 60px)'
                  }}
                >
                  <div className="bg-bolf-black/80 backdrop-blur-md border border-bolf-white/10 rounded-lg p-6 shadow-lg relative"
                       style={{
                         boxShadow: '0 4px 13px 30px rgba(0, 191, 255, 0.15), 0 0 20px rgba(255, 165, 0, 0.1)'
                       }}>
                    {/* Date badge */}
                    <div
                      className={`absolute -top-4 px-4 py-1.5 rounded text-sm font-bold text-bolf-white z-10 whitespace-nowrap ${
                        isOdd ? 'left-6' : 'right-6'
                      }`}
                      style={{
                        background: 'linear-gradient(135deg, #00BFFF, #FFA500)',
                        boxShadow: '0 2px 8px rgba(0, 191, 255, 0.4)',
                        letterSpacing: '1px'
                      }}
                    >
                      {milestone.date}
                    </div>

                    {/* Description */}
                    <div className="mt-4">
                      <p className="text-bolf-gray text-base md:text-lg leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default MilestoneTimeline;

