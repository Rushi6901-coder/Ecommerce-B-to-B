import { API_ENDPOINTS } from '../config/api';

/**
 * Helper to resolve image URL
 * Handles full URLs, base64, and relative paths by prepending backend base URL.
 * matches logic in CategoryManager.jsx but reused globally.
 */
export const getValidImageUrl = (path) => {
    if (!path) return null;

    // If it's already a full URL or base64 data, return as is
    if (path.startsWith('http') || path.startsWith('data:') || path.startsWith('blob:')) {
        return path;
    }

    // Normalize backslashes to forward slashes
    const normalizedPath = path.replace(/\\/g, '/');

    // Determine Base URL (e.g., http://localhost:8080)
    // API_ENDPOINTS.categories is usually http://localhost:8080/api/categories
    // We split by '/api' to get the root host + port
    const categoriesUrl = API_ENDPOINTS.categories || '';
    const baseUrlInternal = categoriesUrl.includes('/api')
        ? categoriesUrl.split('/api')[0]
        : 'http://localhost:8080'; // Fallback

    // If path contains '/uploads/', assume everything after (inclusive) is the relative path
    // e.g., "D:/Start/uploads/img.png" -> "uploads/img.png"
    // e.g., "/var/www/uploads/img.png" -> "uploads/img.png"
    if (normalizedPath.toLowerCase().includes('/uploads/')) {
        const relativePath = normalizedPath.substring(normalizedPath.toLowerCase().indexOf('/uploads/'));
        // If relativePath starts with /, remove it to avoid double slash when joining with baseUrl if baseUrl has no trailing slash,
        // but here we appended logic covers it.
        // Let's ensure strict handling:
        // API_ENDPOINTS.categories handles base.
        // If we extracted "uploads/img.png", we append to base (host:port).
        // Since we split by /api, baseUrl is http://localhost:8080.
        // So http://localhost:8080/uploads/img.png is valid.

        return `${baseUrlInternal}${baseUrlInternal.endsWith('/') ? '' : '/'}${relativePath.startsWith('/') ? relativePath.substring(1) : relativePath}`;
    }

    // Handle standard relative paths or assume filename needs /uploads/ prepended if it looks like a filename
    // and doesn't start with /
    let finalPath = normalizedPath;

    // If it looks like a raw filename (no slashes) or just a simple path, assume it might need "uploads/"?
    // User said "local storage", implied absolute path was provided.
    // If logic above failed (no "uploads" in string), but it's an absolute path?
    // e.g. "D:/Images/shirt.png". We can't serve that.
    // We have to guess where it is served.
    // SAFEST GUESS: It is in uploads folder.

    if (finalPath.includes(':')) {
        // It has a drive letter or protocol (but protocol handled at start).
        // Take filename only.
        const filename = finalPath.split('/').pop();
        finalPath = `uploads/${filename}`;
    } else if (!finalPath.startsWith('/')) {
        // Relative path? Ensure it starts with slash
        finalPath = `/${finalPath}`;
    }

    return `${baseUrlInternal}${finalPath.startsWith('/') ? '' : '/'}${finalPath}`;
};
