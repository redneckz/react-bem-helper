import camelCase from 'lodash/camelCase';
import upperFirst from 'lodash/upperFirst';
import isString from 'lodash/isString';
import startsWith from 'lodash/startsWith';
import {assertion} from '../utils';

export function isValidNamePart(name) {
    return isString(name) && name.split('-')
            .every(word => /^[a-z][a-z0-9]*$/.test(word));
}

export function isValidComponentName(componentName, name) {
    return !componentName ||
        (isValidNamePart(name) && (componentName === upperFirst(camelCase(name))));
}

export function isValidModifierComponentName(componentName, name) {
    return !componentName ||
        (isValidNamePart(name) && startsWith(componentName, upperFirst(camelCase(name))));
}

export const assertNamePart = assertion(
    isValidNamePart,
    'Invalid name part'
);

export const assertComponentName = assertion(
    (component, name) => isValidComponentName(component.name, name),
    'Invalid component name'
);

export const assertModifierComponentName = assertion(
    (component, name) => isValidModifierComponentName(component.name, name),
    'Invalid modifier component name'
);
