// @flow

/**
 * Translates string to kebab-case
 */
export function kebabCase(str?: mixed): string {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return kebabCase(String(str));
    }
    return str
        .replace(/([A-Z]+)/g, '-$1')
        .replace(/\W+/g, '-')
        .replace(/^\W+/, '')
        .replace(/\W+$/, '')
        .toLowerCase();
}
