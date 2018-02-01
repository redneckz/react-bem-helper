import {Config} from '../config';
import {createModifiersMapper} from './modifiers-mapper-creator';

export function createBlockNameFactory(block) {
    if (!block) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    return createModifiersMapper(block);
}

export function createElementNameFactory(block, element) {
    if (!block) {
        throw new TypeError('[BEM] Block name should be defined');
    }
    if (!element) {
        throw new TypeError('[BEM] Element name should be defined');
    }
    return createModifiersMapper(`${block}${Config.ELEMENT_SEPARATOR}${element}`);
}
