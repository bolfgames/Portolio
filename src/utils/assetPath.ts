/**
 * Asset Path Utility
 * Handles asset paths with base URL for GitHub Pages
 */

/**
 * Get asset path with base URL
 * @param path - Asset path starting with /
 * @returns Asset path with base URL (e.g., /Portolio/assets/...)
 */
export function getAssetPath(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get base URL from Vite (includes trailing slash)
  const baseUrl = import.meta.env.BASE_URL;
  
  // Combine base URL with path
  return `${baseUrl}${cleanPath}`;
}

