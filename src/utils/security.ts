/**
 * Security utility functions for the application
 */

/**
 * Sanitizes a string input to prevent XSS attacks
 * @param input The string to sanitize
 * @returns The sanitized string
 */
export const sanitizeInput = (input: string): string => {
  if (!input) return '';

  // Replace HTML special characters with their entity equivalents
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
};

/**
 * Sanitizes an object's string properties
 * @param obj The object to sanitize
 * @returns A new object with sanitized string properties
 */
export const sanitizeObject = <T extends Record<string, unknown>>(obj: T): T => {
  const result = { ...obj } as T;

  Object.keys(result).forEach(key => {
    const value = result[key as keyof T];
    if (typeof value === 'string') {
      (result as Record<string, unknown>)[key] = sanitizeInput(value);
    }
  });

  return result;
};

/**
 * Adds CSRF token to request headers
 * @param headers The headers object to add the CSRF token to
 * @returns The headers object with the CSRF token added
 */
export const addCsrfToken = (headers: Record<string, string>): Record<string, string> => {
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    return {
      ...headers,
      'X-CSRF-Token': csrfToken,
    };
  }
  return headers;
};

/**
 * Gets the CSRF token from the meta tag
 * @returns The CSRF token or null if not found
 */
export const getCsrfToken = (): string | null => {
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute('content') : null;
};
