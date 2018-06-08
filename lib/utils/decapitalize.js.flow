// @flow

export function decapitalize(str?: mixed): string {
    if (str === null || str === undefined || str === '') {
        return '';
    }
    if (typeof str !== 'string') {
        return decapitalize(String(str));
    }
    return `${str[0].toLowerCase()}${str.substr(1)}`;
}
