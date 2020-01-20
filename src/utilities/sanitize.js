import HTML4Entities from '../data/HTML4Entities.json';

const scriptTags = /<script[^>]*>([\S\s]*?)<\/script>/gmi;
const styleTags = /<style[^>]*>([\S\s]*?)<\/style>/gmi;
const allTags = /<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi;

const namedEntities = new RegExp(`&(${Object.keys(HTML4Entities).join('|')});`, 'g');
const numericEntities = /&#(\d+);/g;

/**
 * Naive stripping of HTML tags.
 * Removes <style> and <script> tags including their contents.
 *
 * Notice: For real HTML parsing, you shouold not use regex.
 * See: https://stackoverflow.com/questions/1732348/regex-match-open-tags-except-xhtml-self-contained-tags/1732454#1732454
 * @param {string} input HTML string
 */
export const stripTags = input => {
    if (typeof input !== 'string') {
        return '';
    }

    return input
        .replace(scriptTags, '')
        .replace(styleTags, '')
        .replace(allTags, '');
};

/**
 * Decode HTML entities.
 * Handles HTML 4 named entities and (most) numeric entities.
 * @param {string} string HTML string
 */
export const decodeEntities = input => {
    if (typeof input !== 'string') {
        return '';
    }

    return input
        .replace(namedEntities, (_, ent) => HTML4Entities[ent])
        .replace(numericEntities, (_, ent) => String.fromCharCode(ent));
};

/**
 * Replace any sequences of whitespace characters with a single space.
 * @param {string} input
 */
export const normalizeWhitespace = input => {
    if (typeof input !== 'string') {
        return '';
    }

    return input.replace(/\s+/g, ' ');
};

/**
 * Prepare a string for being used as an HTML attribute value,
 * by stripping HTML tags and decode entities.
 * @param {string} input HTML string
 */
export const sanitizeAttributeValue = input => {
    if (typeof input !== 'string') {
        return '';
    }

    return normalizeWhitespace(decodeEntities(stripTags(input))).trim();
};

export default {
    stripTags,
    decodeEntities,
    normalizeWhitespace,
    sanitizeAttributeValue
};
