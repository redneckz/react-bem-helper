// @flow
import type { CSSModule } from '../bem-helper-types';
import { BEMConfig } from '../bem-config';

type BEMEntityModifier = string;
type BEMEntityDescriptor = [string, BEMEntityModifier[]];

export function parseBEMName(name: string): [string, string | void, string | void] {
    const { ELEMENT_SEPARATOR, MODIFIER_SEPARATOR } = BEMConfig;
    const namePattern = `^(.+?)(${ELEMENT_SEPARATOR}(.+?))?(${MODIFIER_SEPARATOR}(.+))?$`;
    const [, blockName, , elementName, , modifier] = name.match(namePattern) || [];
    return [blockName, elementName, modifier];
}

export function findoutBlockDescriptor(styles: CSSModule): BEMEntityDescriptor {
    const namesList = Object.keys(styles);
    const [someName] = namesList;
    const [blockName] = parseBEMName(someName);
    return [blockName, findoutModifiers(namesList)(blockName)];
}

export function findoutElementDescriptors(styles: CSSModule): BEMEntityDescriptor[] {
    const namesList = Object.keys(styles);
    return namesList
        .map(parseBEMName)
        .map(([, elementName]) => elementName)
        .filter(Boolean)
        .map(elementName => [elementName, findoutModifiers(namesList)(elementName)]);
}

function findoutModifiers(namesList: string[]) {
    return (name: string): string[] =>
        namesList
            .map(parseBEMName)
            .filter(([blockName, elementName]) => blockName === name || elementName === name)
            .map(([, , modifier]) => modifier)
            .filter(Boolean);
}
