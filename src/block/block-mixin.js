import {element} from '../element';

export function blockMixin({blockName, blockStyles}, TargetComponent) {
    TargetComponent.BEM = true; // eslint-disable-line no-param-reassign
    TargetComponent.element = element.bind({blockName, blockStyles}); // eslint-disable-line no-param-reassign
    return TargetComponent;
}
