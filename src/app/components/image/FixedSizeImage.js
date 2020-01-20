import React from 'react';
import PropTypes from 'prop-types';
import MaybeLazyImage from './MaybeLazyImage';
import {
    defaultDensities as densities,
    withQuery
} from './helpers';

/**
 * Link to an image on imgix.net with optimization params, and optional size restrictions.
 * @param {string} src must be an imgix.net image URL
 */
const FixedSizeImage = ({ src, width, height, naturalWidth, naturalHeight, scaleImage, ...props }) => (
    <MaybeLazyImage
        key={src}
        src={scaledSrc(src, width, height, naturalWidth, naturalHeight)}
        {...(scaleImage ? {srcSet: (width || height) ? srcSet(src, width, height, naturalWidth, naturalHeight) : null} : {})}
        {...props}
    />
);

FixedSizeImage.propTypes = {
    src: PropTypes.string.isRequired,
    width: PropTypes.number,
    height: PropTypes.number,
    naturalWidth: PropTypes.number,
    naturalHeight: PropTypes.number,
    scaleImage: PropTypes.bool
};

FixedSizeImage.defaultProps = {
    naturalWidth: Infinity,
    naturalHeight: Infinity,
    scaleImage: false
};

export default FixedSizeImage;

// -- helpers --

/**
 * Generate `srcset` attribute value with upscaled versions for
 * higher density displays (e.g. `2x` etc.)
 */
const srcSet = (src, width, height, naturalWidth, naturalHeight) => densities.map(density =>
    `${scaledSrc(src, width && Math.round(width * density), height && Math.round(height * density), naturalWidth, naturalHeight)} ${density}x`
).join(`, `);

/** Format imgix.net URL width scaling query parameters */
const scaledSrc = (src='', width, height, naturalWidth, naturalHeight) => !src.includes('.imgix.net') ? src : withQuery(src, {
    auto: `format,compress`,
    fit: `crop`,
    w: width && Math.min(width, naturalWidth),
    h: height && Math.min(height, naturalHeight)
});