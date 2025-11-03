import { useEffect, useState } from 'react';
import { settingsService } from '../../services/settingsService';
import type { TeamMember } from '../../models/types';
import { ROLE_COLORS } from '../../models/types';

// Import all card style components
import { DefaultTeamMemberCard } from './cardStyles/DefaultCardStyle';
import { GlowTeamMemberCard } from './cardStyles/GlowCardStyle';
import { InteractionTeamMemberCard } from './cardStyles/InteractionCardStyle';
import { ThreeDTeamMemberCard } from './cardStyles/ThreeDCardStyle';
import { NFTTeamMemberCard } from './cardStyles/NFTCardStyle';

interface TeamMemberCardProps {
  member: TeamMember;
  onClick: () => void;
}

/**
 * Team Member Card Component - Displays team member information
 * Follows Single Responsibility Principle and Strategy Pattern
 * Dynamically selects card style based on settings
 * Uses "Prefabrik" approach with role-based colors
 */
function TeamMemberCard({ member, onClick }: TeamMemberCardProps) {
  const roleColor = ROLE_COLORS[member.roleType];
  const [cardStyle, setCardStyle] = useState(() => settingsService.getTeamCardStyle());

  // Listen to settings changes
  useEffect(() => {
    const unsubscribe = settingsService.subscribe(() => {
      setCardStyle(settingsService.getTeamCardStyle());
    });

    return unsubscribe;
  }, []);

  // Common props for all card styles
  const commonProps = {
    member,
    onClick,
    roleColor,
  };

  // Render based on selected card style
  switch (cardStyle) {
    case 'glow':
      return <GlowTeamMemberCard {...commonProps} />;
    case 'interaction':
      return <InteractionTeamMemberCard {...commonProps} />;
    case '3d':
      return <ThreeDTeamMemberCard {...commonProps} />;
    case 'nft':
      return <NFTTeamMemberCard {...commonProps} />;
    case 'default':
    default:
      return <DefaultTeamMemberCard {...commonProps} />;
  }
}

export default TeamMemberCard;
