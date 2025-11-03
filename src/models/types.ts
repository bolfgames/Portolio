// Team Member Types
export interface TeamMember {
  id: number;
  name: string;
  role: string;
  roleType: 'developer' | '3d-artist' | '2d-artist' | 'designer' | 'level-designer';
  bio: string;
  avatar: string;
  avatarCrop?: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
    rotation: number;
  };
  projects: Project[];
  socialLinks: SocialLinks;
}

export interface SocialLinks {
  discord?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  portfolio?: string;
}

// Project Types
export interface Project {
  id: number;
  name: string;
  description: string;
  platforms: Platform[];
  image: string;
  video?: string; // Video URL for projects
  link?: string;
  tags?: string[];
  type?: 'game' | 'media'; // Game or media content (Instagram/Youtube)
}

export type Platform = 'PC' | 'Mobile' | 'Web' | 'Console';

// Team Config
export interface TeamConfig {
  members: TeamMember[];
}

// Projects Config
export interface ProjectsConfig {
  projects: Project[];
}

// Role Color Mapping
export type RoleType = TeamMember['roleType'];

export const ROLE_COLORS: Record<RoleType, string> = {
  'developer': '#00BFFF',
  '3d-artist': '#FFA500',
  '2d-artist': '#FFD700',
  'designer': '#9B59B6',
  'level-designer': '#2ECC71',
};

