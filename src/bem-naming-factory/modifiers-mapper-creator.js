import kebabCase from 'lodash/kebabCase';
import {Config} from '../config';

export function createModifiersMapper(name) {
    return function mapModifier(modifier) { // eslint-disable-line consistent-return
        if ((modifier === undefined) || modifier === '') {
            return name;
        } else if (typeof modifier === 'string') {
            const adjustedModifier = toKebabCase(modifier);
            return `${name}${Config.MODIFIER_SEPARATOR}${adjustedModifier}`;
        } else if (Array.isArray(modifier)) {
            return modifier.filter(Boolean).map(mapModifier);
        }
        // Object
        return Object.assign(
            ...Object.keys(modifier).map(key => ({
                [mapModifier(key)]: modifier[key]
            }))
        );
    };
}

function toKebabCase(modifier) {
    return kebabCase(modifier)
        .replace(/-(\d)/g, '$1'); // name part should not start with digit
}
