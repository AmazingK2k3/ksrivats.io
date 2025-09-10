/**
 * Utility function to resolve image paths for different content types
 * Handles both relative and absolute paths, and maps them to the correct public directory
 */
export function resolveImagePath(imagePath: string, contentType?: 'project' | 'creative' | 'post'): string {
  if (!imagePath) {
    return '';
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Handle absolute paths that start with /
  if (imagePath.startsWith('/')) {
    // Remove leading slash for consistency
    imagePath = imagePath.substring(1);
  }

  // Based on content type, determine the appropriate directory
  let basePath = '/';
  
  switch (contentType) {
    case 'project':
      // Projects are in root public directory
      basePath = '/';
      break;
      
    case 'creative':
      // Creatives are typically in /creatives/ subdirectory
      if (imagePath.includes('/')) {
        basePath = '/';
      } else {
        basePath = '/creatives/';
      }
      break;
      
    case 'post':
    default:
      // Posts and general images are in root public
      basePath = '/';
      break;
  }

  // Construct the final path
  let finalPath = basePath + imagePath;
  
  // Clean up double slashes
  finalPath = finalPath.replace(/\/+/g, '/');
  
  // Ensure it starts with /
  if (!finalPath.startsWith('/')) {
    finalPath = '/' + finalPath;
  }

  return finalPath;
}

export default resolveImagePath;
