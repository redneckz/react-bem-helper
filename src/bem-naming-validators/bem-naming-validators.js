import isString from 'lodash/isString';
import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import {Config} from '../config';

export function isValidNamePart(name) {
    return isString(name) && name.split('-')
        .every(word => /^[a-z][a-z0-9]*$/.test(word));
}

export function isValidComponentName(componentName, name) {
    return componentName && isString(name) && (componentName === upperFirst(camelCase(name)));
}

export const assertNamePart = assertion(
    isValidNamePart,
    'Invalid name part'
);

export const assertComponentName = assertion(
    isValidComponentName,
    'Invalid component name'
);

function assertion(validator, message) {
    return (...args) => {
        if (Config.ASSERTION_ENABLED && !validator(...args)) {
            throw new Error(`[BEM] ${message}: ${JSON.stringify(args)}`);
        }
    };
}
