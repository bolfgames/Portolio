import type { Project } from '../../../models/types';
import type { TeamMember } from '../../../models/types';

/**
 * Base props for all card style components
 * Follows Interface Segregation Principle
 */
export interface BaseCardStyleProps {
  className?: string;
}

/**
 * Props for project card styles
 */
export interface ProjectCardStyleProps extends BaseCardStyleProps {
  project: Project;
  isVideoPlaying?: boolean;
  onVideoPlay?: () => void;
  onVideoEnd?: () => void;
  onCardClick?: () => void;
}

/**
 * Props for team member card styles
 */
export interface TeamMemberCardStyleProps extends BaseCardStyleProps {
  member: TeamMember;
  onClick: () => void;
  roleColor: string;
}

