// Helper functions for Image components
import queryString from 'query-string';

/** Additional pixel densities to generate srcset for */
export const defaultDensities = [1.5, 2, 3];

/**
 * Append a query string to a URL
 * @param {string} src URL
 * @param {object} query map of query parameters. Empty values will be filtered out.
 */
export const withQuery = (src, query) => src && [src, queryString.stringify(query)].join(src.includes('?') ? '&' : '?');