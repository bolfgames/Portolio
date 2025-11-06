import { useState, useEffect } from 'react';
import { settingsService } from '../../services/settingsService';
import type { Project } from '../../models/types';

// Import all card style components
import { DefaultProjectCard } from './cardStyles/DefaultCardStyle';
import { GlowProjectCard } from './cardStyles/GlowCardStyle';
import { InteractionProjectCard } from './cardStyles/InteractionCardStyle';
import { ThreeDProjectCard } from './cardStyles/ThreeDCardStyle';
import { NFTProjectCard } from './cardStyles/NFTCardStyle';

interface ProjectCardProps {
  project: Project;
  onCardClick?: (project: Project) => void;
}

/**
 * Project Card Component - Displays project information with video support
 * Follows Single Responsibility Principle and Strategy Pattern
 * Dynamically selects card style based on settings
 */
function ProjectCard({ project, onCardClick }: ProjectCardProps) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [cardStyle, setCardStyle] = useState(() => settingsService.getProjectCardStyle());

  // Listen to settings changes
  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      setCardStyle(settingsService.getProjectCardStyle());
    });

    return unsubscribe;
  }, []);

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const handleCardClick = () => {
    if (onCardClick) {
      onCardClick(project);
    }
  };

  // Common props for all card styles
  const commonProps = {
    project,
    isVideoPlaying,
    onVideoPlay: handleVideoPlay,
    onVideoEnd: handleVideoEnd,
    onCardClick: handleCardClick,
  };

  // Render based on selected card style
  switch (cardStyle) {
    case 'glow':
      return <GlowProjectCard {...commonProps} />;
    case 'interaction':
      return <InteractionProjectCard {...commonProps} />;
    case '3d':
      return <ThreeDProjectCard {...commonProps} />;
    case 'nft':
      return <NFTProjectCard {...commonProps} />;
    case 'default':
    default:
      return <DefaultProjectCard {...commonProps} />;
  }
}

export default ProjectCard;
