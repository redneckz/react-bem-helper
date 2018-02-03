/**
 * Translates string to kebab-case
 *
 * @param {string} str - any string
 * @return {string} kebab-case string
 */
export function kebabCase(str) {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return kebabCase(String(str));
    }
    return str.replace(/([A-Z]+)/g, '-$1')
        .replace(/\W+/g, '-')
        .replace(/^\W+/, '')
        .replace(/\W+$/, '')
        .toLowerCase();
}
