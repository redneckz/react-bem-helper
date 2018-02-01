/* eslint-disable no-param-reassign */
import {element} from '../element';

export function blockMixin({blockName, blockStyles}, TargetComponent) {
    TargetComponent.element = element.bind({blockName, blockStyles});
    return TargetComponent;
}
