import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import mapKeys from 'lodash/mapKeys';
import kebabCase from 'lodash/kebabCase';
import isArray from 'lodash/isArray';
import isUndefined from 'lodash/isUndefined';
import negate from 'lodash/negate';
import {Config} from '../config';
import {assertNamePart} from '../bem-naming-validators';

const {ELEMENT_SEPARATOR, MODIFIER_SEPARATOR} = Config;

export function createBlockNameFactory(block) {
    assertNamePart(block);
    return createModifiersMapper(block);
}

export function createElementNameFactory(block, element) {
    assertNamePart(block);
    assertNamePart(element);
    return createModifiersMapper(`${block}${ELEMENT_SEPARATOR}${element}`);
}

export function createModifiersMapper(name) {
    return function mapModifier(modifier) {
        if (isString(modifier)) {
            return `${name}${MODIFIER_SEPARATOR}${kebabCase(modifier)}`;
        } else if (isPlainObject(modifier)) {
            return mapKeys(modifier, (value, key) => mapModifier(key));
        } else if (isArray(modifier)) {
            return modifier.filter(negate(isUndefined)).map(mapModifier);
        }
        return name;
    };
}
