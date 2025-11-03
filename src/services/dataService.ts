import teamData from '../config/team.json';
import projectsData from '../config/projects.json';
import translationsData from '../config/translations.json';
import type { TeamConfig, ProjectsConfig, TeamMember, Project } from '../models/types';
import type { Translations, Language } from '../models/i18n';

/**
 * Data Service - Business logic for fetching application data
 * Follows Dependency Inversion Principle
 */
class DataService {
  private teamConfig: TeamConfig = teamData as TeamConfig;
  private projectsConfig: ProjectsConfig = projectsData as ProjectsConfig;
  private translations: Translations = translationsData as Translations;
  private currentLanguage: Language = 'tr';

  /**
   * Set current language for localized data
   */
  setLanguage(language: Language): void {
    this.currentLanguage = language;
  }

  /**
   * Get localized project data (name is NOT localized - it's the original name)
   */
  private getLocalizedProject(projectId: number): { description: string; tags?: string[] } | null {
    const localizedData = this.translations[this.currentLanguage]?.data?.projects;
    if (!localizedData) {
      // Fallback to English if current language doesn't have data
      const enData = this.translations.en?.data?.projects;
      if (!enData) return null;
      const fallback = enData.find((p: any) => p.id === projectId);
      if (!fallback) return null;
      return {
        description: fallback.description,
        tags: fallback.tags,
      };
    }
    const localized = localizedData.find((p: any) => p.id === projectId);
    if (!localized) return null;
    return {
      description: localized.description,
      tags: localized.tags,
    };
  }

  /**
   * Get localized team member data (name is NOT localized - it's the person's real name)
   */
  private getLocalizedTeamMember(memberId: number): { role: string; bio: string } | null {
    const localizedData = this.translations[this.currentLanguage]?.data?.team;
    if (!localizedData) {
      // Fallback to English if current language doesn't have data
      const enData = this.translations.en?.data?.team;
      if (!enData) return null;
      const fallback = enData.find((m: any) => m.id === memberId);
      if (!fallback) return null;
      return {
        role: fallback.role,
        bio: fallback.bio,
      };
    }
    const localized = localizedData.find((m: any) => m.id === memberId);
    if (!localized) return null;
    return {
      role: localized.role,
      bio: localized.bio,
    };
  }

  /**
   * Get all team members with localized data
   */
  getAllTeamMembers(language?: Language): TeamMember[] {
    const lang = language || this.currentLanguage;
    const previousLang = this.currentLanguage;
    this.currentLanguage = lang;
    
    const members = this.teamConfig.members.map(member => {
      const localized = this.getLocalizedTeamMember(member.id);
      return {
        ...member,
        // name is NOT localized - it's the person's real name
        role: localized?.role || member.role,
        bio: localized?.bio || member.bio,
      };
    });
    
    this.currentLanguage = previousLang;
    return members;
  }

  /**
   * Get team member by ID with localized data
   */
  getTeamMemberById(id: number, language?: Language): TeamMember | undefined {
    const member = this.teamConfig.members.find(m => m.id === id);
    if (!member) return undefined;
    
    const lang = language || this.currentLanguage;
    const previousLang = this.currentLanguage;
    this.currentLanguage = lang;
    
    const localized = this.getLocalizedTeamMember(id);
    const result = {
      ...member,
      // name is NOT localized - it's the person's real name
      role: localized?.role || member.role,
      bio: localized?.bio || member.bio,
    };
    
    this.currentLanguage = previousLang;
    return result;
  }

  /**
   * Convert name to slug for URL
   * Examples: "Furkan Gündüz" -> "Furkan", "Ahmet Emir Özdemir" -> "AhmetEmir"
   */
  getNameSlug(name: string): string {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0];
    if (parts.length >= 3) {
      // 3+ words: first two words combined (e.g., "Ahmet Emir Özdemir" -> "AhmetEmir")
      return parts[0] + parts[1];
    }
    // 2 words: first word only (e.g., "Furkan Gündüz" -> "Furkan")
    return parts[0];
  }

  /**
   * Get team member by name slug with localized data
   */
  getTeamMemberBySlug(slug: string, language?: Language): TeamMember | undefined {
    const member = this.teamConfig.members.find(m => {
      const memberSlug = this.getNameSlug(m.name);
      return memberSlug.toLowerCase() === slug.toLowerCase();
    });
    if (!member) return undefined;
    
    return this.getTeamMemberById(member.id, language);
  }

  /**
   * Get all projects with localized data
   */
  getAllProjects(language?: Language): Project[] {
    const lang = language || this.currentLanguage;
    const previousLang = this.currentLanguage;
    this.currentLanguage = lang;
    
    const projects = this.projectsConfig.projects.map(project => {
      const localized = this.getLocalizedProject(project.id);
      return {
        ...project,
        // name is NOT localized - it's the original project name
        description: localized?.description || project.description,
        tags: localized?.tags || project.tags,
      };
    });
    
    this.currentLanguage = previousLang;
    return projects;
  }

  /**
   * Get project by ID with localized data
   */
  getProjectById(id: number, language?: Language): Project | undefined {
    const project = this.projectsConfig.projects.find(p => p.id === id);
    if (!project) return undefined;
    
    const lang = language || this.currentLanguage;
    const previousLang = this.currentLanguage;
    this.currentLanguage = lang;
    
    const localized = this.getLocalizedProject(id);
    const result = {
      ...project,
      // name is NOT localized - it's the original project name
      description: localized?.description || project.description,
      tags: localized?.tags || project.tags,
    };
    
    this.currentLanguage = previousLang;
    return result;
  }

  /**
   * Get team members by role type with localized data
   */
  getTeamMembersByRole(roleType: TeamMember['roleType']): TeamMember[] {
    return this.getAllTeamMembers().filter(member => member.roleType === roleType);
  }
}

// Singleton instance
export const dataService = new DataService();

