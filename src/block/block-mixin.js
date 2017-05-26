import {element} from '../element';

export function blockMixin({blockName, blockStyles}, TargetComponent) {
    // eslint-disable-next-line no-param-reassign
    TargetComponent.element = element.bind({blockName, blockStyles});
    return TargetComponent;
}
