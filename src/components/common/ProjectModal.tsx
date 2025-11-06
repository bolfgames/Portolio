import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Project } from '../../models/types';
import { getAssetPath } from '../../utils/assetPath';
import './ProjectModal.css';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

// Helper function to get project images based on project name
const getProjectImages = (projectName: string): string[] => {
  const imageMap: Record<string, string[]> = {
    'Durih': [
      'assets/resumes/Emir/project_images/durih_1.jpg',
      'assets/resumes/Emir/project_images/durih_2.png',
      'assets/resumes/Emir/project_images/durih_3.png',
      'assets/resumes/Emir/project_images/durih_4.png',
      'assets/resumes/Emir/project_images/durih_5.png',
    ],
    'Lunscale': [
      'assets/resumes/AhmetEmir/project_images/Lunscale/lundscale_1.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/lundscale_2.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/lundscale_3.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/lundscale_4.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/1001.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/1002.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/1003.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/1004.jpg',
      'assets/resumes/AhmetEmir/project_images/Lunscale/1005.jpg',
    ],
    'Gloveffect': [
      'assets/resumes/Emir/project_images/Gloveffect_1.jpg',
      'assets/resumes/Emir/project_images/Gloveffect_2.jpg',
      'assets/resumes/Emir/project_images/Gloveffect_3.jpg',
      'assets/resumes/Emir/project_images/Gloveffect_4.jpg',
      'assets/resumes/Emir/project_images/Gloveffect_5.jpg',
      'assets/resumes/Emir/project_images/Gloveffect_6.jpg',
    ],
    'the Birdie': [
      'assets/resumes/AhmetEmir/project_images/TheBirdie/birdie_1.png',
      'assets/resumes/AhmetEmir/project_images/TheBirdie/birdie_2.png',
      'assets/resumes/AhmetEmir/project_images/TheBirdie/birdie_3.png',
      'assets/resumes/AhmetEmir/project_images/TheBirdie/birdie_4.png',
      'assets/resumes/AhmetEmir/project_images/TheBirdie/birdie_5.png',
    ],
    'BOLF Medya': [
      'assets/icons/fulllogobznpng_Çalışma Yüzeyi 1.png',
    ],
  };

  return imageMap[projectName] || [];
};

// Helper function to get video URL for projects
const getProjectVideoUrl = (projectName: string): string | null => {
  const videoMap: Record<string, string> = {
    'Gloveffect': 'https://youtu.be/j-8xLWhAXwU',
    'the Birdie': 'https://drive.google.com/file/d/1A8jXOrAwFPL6pSMrhwAQCO7jP50T83Ee/view?usp=sharing',
  };

  return videoMap[projectName] || null;
};

// Check if URL is Google Drive
const isGoogleDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com');
};

// Convert Google Drive URL to embed URL
const getGoogleDriveEmbedUrl = (url: string): string | null => {
  if (!isGoogleDriveUrl(url)) return null;
  const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (!fileIdMatch) return null;
  return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
};

// Extract YouTube video ID from URL
const getYouTubeEmbedUrl = (url: string, autoplay: boolean = false) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  if (!videoId) return null;
  return autoplay 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`
    : `https://www.youtube.com/embed/${videoId}?rel=0`;
};

const getYouTubeThumbnailUrl = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
};

export default function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Calculate display items - memoize to avoid recalculation
  const displayItems = (() => {
    if (!project) return [];
    
    const projectImages = getProjectImages(project.name);
    const finalImages = projectImages.length > 0 ? projectImages : [project.image];
    const videoUrl = getProjectVideoUrl(project.name) || project.video || null;
    const hasVideo = !!videoUrl;
    
    return hasVideo && videoUrl
      ? [{ type: 'video', url: videoUrl } as const, ...finalImages.map(img => ({ type: 'image', src: img } as const))]
      : finalImages.map(img => ({ type: 'image', src: img } as const));
  })();

  // Reset when project changes
  useEffect(() => {
    if (project) {
      setSelectedIndex(0);
      setIsVideoPlaying(false);
      setClickedVideoIndex(null);
    }
  }, [project]);

  // Close on ESC key and backdrop click
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // When selectedIndex changes via prev/next, reset video if it's a video
  useEffect(() => {
    if (displayItems.length === 0) return;
    
    const item = displayItems[selectedIndex];
    if (item && item.type === 'video') {
      if (clickedVideoIndex !== selectedIndex) {
        setIsVideoPlaying(false);
      }
    } else {
      setClickedVideoIndex(null);
      setIsVideoPlaying(false);
    }
  }, [selectedIndex, displayItems, clickedVideoIndex]);

  if (!project) return null;

  // Get project images for thumbnail calculation
  const projectImages = getProjectImages(project.name);
  // Fallback to main image if no images found
  const finalImages = projectImages.length > 0 ? projectImages : [project.image];

  const currentItem = displayItems[selectedIndex];
  let embedUrl: string | null = null;
  let thumbnailUrl: string | null = null;
  
  if (currentItem && currentItem.type === 'video' && currentItem.url) {
    if (isGoogleDriveUrl(currentItem.url)) {
      embedUrl = getGoogleDriveEmbedUrl(currentItem.url);
      // Use first project image as thumbnail for Google Drive videos
      thumbnailUrl = finalImages.length > 0 ? finalImages[0] : null;
    } else {
      embedUrl = getYouTubeEmbedUrl(currentItem.url, isVideoPlaying);
      thumbnailUrl = getYouTubeThumbnailUrl(currentItem.url);
    }
  }

  const handlePrev = () => {
    if (displayItems.length === 0) return;
    const newIndex = selectedIndex === 0 ? displayItems.length - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setClickedVideoIndex(null);
    setIsVideoPlaying(false);
  };

  const handleNext = () => {
    if (displayItems.length === 0) return;
    const newIndex = (selectedIndex + 1) % displayItems.length;
    setSelectedIndex(newIndex);
    setClickedVideoIndex(null);
    setIsVideoPlaying(false);
  };

  const handleThumbnailClick = (index: number) => {
    if (displayItems.length === 0) return;
    const item = displayItems[index];
    
    if (item.type === 'video') {
      setSelectedIndex(index);
      setClickedVideoIndex(index);
      setIsVideoPlaying(true);
    } else {
      setSelectedIndex(index);
      setClickedVideoIndex(null);
      setIsVideoPlaying(false);
    }
  };

  const scrollThumbnails = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 200;
    scrollContainerRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - clickable to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="project-modal-backdrop"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="project-modal-container"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="project-modal-content">
              {/* Header */}
              <div className="project-modal-header">
                <div>
                  <h2 className="project-modal-title">{project.name}</h2>
                  <p className="project-modal-description">{project.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="project-modal-close"
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Main Display */}
              <div className="project-modal-main-display">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="project-modal-main-content"
                  >
                    {currentItem.type === 'video' && embedUrl ? (
                      <div className="project-modal-video-container">
                        {!isVideoPlaying && thumbnailUrl ? (
                          <div 
                            className="project-modal-video-thumbnail"
                            onClick={() => {
                              setClickedVideoIndex(selectedIndex);
                              setIsVideoPlaying(true);
                            }}
                          >
                            <img
                              src={getAssetPath(thumbnailUrl)}
                              alt={`${project.name} video thumbnail`}
                              className="project-modal-video-thumbnail-img"
                            />
                            <div className="project-modal-video-play-button">
                              <svg width="40" height="40" fill="#00BFFF" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <iframe
                            key={`video-${selectedIndex}`}
                            src={embedUrl}
                            title={project.name}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="project-modal-video-iframe"
                          />
                        )}
                      </div>
                    ) : (
                      <img
                        src={getAssetPath(currentItem.type === 'image' ? currentItem.src : '')}
                        alt={`${project.name} - ${selectedIndex + 1}`}
                        className="project-modal-main-image"
                        loading="eager"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Arrows */}
                {displayItems.length > 1 && (
                  <>
                    <button
                      className="project-modal-nav-btn project-modal-nav-prev"
                      onClick={handlePrev}
                      aria-label="Previous"
                    >
                      <ChevronLeft size={20} color="#00BFFF" />
                    </button>
                    <button
                      className="project-modal-nav-btn project-modal-nav-next"
                      onClick={handleNext}
                      aria-label="Next"
                    >
                      <ChevronRight size={20} color="#00BFFF" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnail Strip */}
              {displayItems.length > 1 && (
                <div className="project-modal-thumbnail-container">
                  <button
                    className="project-modal-scroll-btn project-modal-scroll-left"
                    onClick={() => scrollThumbnails('left')}
                    aria-label="Scroll left"
                  >
                    <ChevronLeft size={16} color="#00BFFF" />
                  </button>
                  
                  <div className="project-modal-thumbnail-strip" ref={scrollContainerRef}>
                    {displayItems.map((item, index) => (
                      <button
                        key={index}
                        className={`project-modal-thumbnail ${selectedIndex === index ? 'active' : ''}`}
                        onClick={() => handleThumbnailClick(index)}
                        aria-label={`View ${item.type === 'video' ? 'video' : `image ${index + 1}`}`}
                      >
                        {item.type === 'video' ? (
                          <div className="project-modal-thumbnail-video">
                            {thumbnailUrl ? (
                              <img
                                src={getAssetPath(thumbnailUrl)}
                                alt="Video thumbnail"
                                className="project-modal-thumbnail-image"
                                style={{ opacity: 0.7 }}
                              />
                            ) : null}
                            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1 }}>
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        ) : (
                          <img
                            src={getAssetPath(item.type === 'image' ? item.src : '')}
                            alt={`${project.name} thumbnail ${index + 1}`}
                            className="project-modal-thumbnail-image"
                            loading="lazy"
                          />
                        )}
                      </button>
                    ))}
                  </div>

                  <button
                    className="project-modal-scroll-btn project-modal-scroll-right"
                    onClick={() => scrollThumbnails('right')}
                    aria-label="Scroll right"
                  >
                    <ChevronRight size={16} color="#00BFFF" />
                  </button>
                </div>
              )}

              {/* Project Info */}
              <div className="project-modal-info">
                <div className="project-modal-tags">
                  {project.platforms.map((platform) => (
                    <span key={platform} className="project-modal-tag project-modal-tag-platform">
                      {platform}
                    </span>
                  ))}
                  {project.tags?.map((tag) => (
                    <span key={tag} className="project-modal-tag project-modal-tag-feature">
                      {tag}
                    </span>
                  ))}
                </div>

                {project.link && project.link !== '#' && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal-link"
                  >
                    {project.type === 'media' ? 'İçeriği Görüntüle' : 'Oyunu İncele'}
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
