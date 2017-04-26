import {Config} from '../config';
import {assertNamePart} from '../bem-naming-validators';
import {createModifiersMapper} from './modifiers-mapper-creator';

export function createBlockNameFactory(block) {
    assertNamePart(block);
    return createModifiersMapper(block);
}

export function createElementNameFactory(block, element) {
    assertNamePart(block);
    assertNamePart(element);
    return createModifiersMapper(`${block}${Config.ELEMENT_SEPARATOR}${element}`);
}
