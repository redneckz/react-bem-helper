// @flow

import { capitalize } from './capitalize';
import { decapitalize } from './decapitalize';

export function kebabToCamelCase(str?: mixed): string {
  if (str === null || str === undefined || str === '') {
    return '';
  }
  if (typeof str !== 'string') {
    return kebabToCamelCase(String(str));
  }
  if (str.indexOf('-') === -1) {
    // Not a kebab-case
    return clean(str);
  }
  const [head, ...tail] = (str.match(/[^-]+/g) || []).map(clean);
  return [decapitalize(head), ...tail.map(capitalize)].join('');
}

function clean(str: string): string {
  return str.replace(/^\W+/, '').replace(/\W+$/, '');
}
