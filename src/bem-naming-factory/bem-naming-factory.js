import {Config} from '../config';
import {kebabCase} from '../utils';

/**
 * @typedef {string} Modifier
 * @typedef {string} ClassName
 */

/**
 * Computes class names of block regarding active modifiers
 *
 * @param {string} blockName
 * @return {Array(Modifier) -> Array(ClassName)}
 */
export function blockClassNames(blockName) {
    if (!blockName) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    return modifiedClassNames(blockName);
}

/**
 * Computes class names of element regarding active modifiers
 *
 * @param {string} blockName
 * @param {string} elementName
 * @return {Array(Modifier) -> ClassName}
 */
export function elementClassNames(blockName, elementName) {
    if (!blockName) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    if (!elementName) {
        throw new TypeError('[BEM] Element name should be defined');
    }
    return modifiedClassNames(`${blockName}${Config.ELEMENT_SEPARATOR}${elementName}`);
}

function modifiedClassNames(baseName) {
    return (modifiers = []) => {
        const modifiersClassNames = modifiers
            .filter(Boolean)
            .map(mod => `${baseName}${Config.MODIFIER_SEPARATOR}${kebabCase(mod)}`);
        return [baseName].concat(modifiersClassNames);
    };
}
