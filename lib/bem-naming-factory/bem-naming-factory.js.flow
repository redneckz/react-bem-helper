// @flow
import { BEMConfig } from '../bem-config';
import { kebabCase } from '../utils';

type ModifiersToClassNames = (modifiers?: string[]) => string[];

/**
 * Computes class names of block regarding active modifiers
 */
export function blockClassNames(blockName?: string): ModifiersToClassNames {
    if (!blockName) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    return modifiedClassNames(blockName);
}

/**
 * Computes class names of element regarding active modifiers
 */
export function elementClassNames(blockName?: string, elementName?: string): ModifiersToClassNames {
    if (!blockName) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    if (!elementName) {
        throw new TypeError('[BEM] Element name should be defined');
    }
    return modifiedClassNames(`${blockName}${BEMConfig.ELEMENT_SEPARATOR}${elementName}`);
}

function modifiedClassNames(baseName: string): ModifiersToClassNames {
    return (modifiers) => {
        const modifiersClassNames = modifiers
            ? modifiers
                .filter(Boolean)
                .map(adjustModifier)
                .map(mod => `${baseName}${BEMConfig.MODIFIER_SEPARATOR}${mod}`)
            : [];
        return [baseName].concat(modifiersClassNames);
    };
}

function adjustModifier(modifier: string): string {
    return modifier
        .split(BEMConfig.MODIFIER_SEPARATOR)
        .map(kebabCase)
        .join(BEMConfig.MODIFIER_SEPARATOR);
}
