import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import isArray from 'lodash/isArray';
import mapKeys from 'lodash/mapKeys';
import compact from 'lodash/compact';
import kebabCase from 'lodash/kebabCase';
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

function createModifiersMapper(name) {
    return function mapModifier(modifier) {
        if (modifier && isString(modifier)) {
            const adjustedModifier = kebabCase(modifier);
            assertNamePart(adjustedModifier);
            return `${name}${MODIFIER_SEPARATOR}${adjustedModifier}`;
        } else if (isPlainObject(modifier)) {
            return mapKeys(modifier, (value, key) => mapModifier(key));
        } else if (isArray(modifier)) {
            return compact(modifier).map(mapModifier);
        }
        return name;
    };
}
