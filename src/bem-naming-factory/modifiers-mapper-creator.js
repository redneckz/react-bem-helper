import isString from 'lodash/isString';
import isPlainObject from 'lodash/isPlainObject';
import isUndefined from 'lodash/isUndefined';
import isArray from 'lodash/isArray';
import mapKeys from 'lodash/mapKeys';
import kebabCase from 'lodash/kebabCase';
import compact from 'lodash/compact';
import {assertNamePart} from '../bem-naming-validators';
import {Config} from '../config';
import {assertion} from '../assertion';

const typeAssertion = assertion('Modifier has inappropriate type');

export function createModifiersMapper(name) {
    return function mapModifier(modifier) {  // eslint-disable-line consistent-return
        if (isUndefined(modifier) || modifier === '') {
            return name;
        } else if (isString(modifier)) {
            const adjustedModifier = kebabCase(modifier);
            assertNamePart(adjustedModifier);
            return `${name}${Config.MODIFIER_SEPARATOR}${adjustedModifier}`;
        } else if (isPlainObject(modifier)) {
            return mapKeys(modifier, (value, key) => mapModifier(key));
        } else if (isArray(modifier)) {
            return compact(modifier).map(mapModifier);
        }
        typeAssertion({name, modifier});
    };
}
