/**
 * @name Type
 * @param dimensions
 * @returns {*}
 */
export function type(dimensions) {
    if (dimensions.width > 992) {
        return 'desktop';
    }

    if (dimensions.width > 767) {
        return 'tablet';
    }

    return 'mobile';
}

/**
 * Export all
 */
export default {
    type
};
