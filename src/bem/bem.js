// @flow
import type { CSSModule, Component, BEMEntityProps } from '../bem-helper-types';
import { createBlockContext } from '../create-block-context';
import { block } from '../block';
import { element } from '../element';
import { kebabToCamelCase } from '../utils';
import { findoutBlockDescriptor, findoutElementDescriptors } from './bem-css-parser';
import { modifiersListToModifiersMap } from './modifiers-list-to-modifiers-map';

export type BEMFactory = {
    // block HOC
    <Props: { className?: string }>(
        string | Component<Props>,
    ): Component<$Diff<Props, BEMEntityProps>>,
    // element HOCs
    [elementName: string]: <Props: { className?: string }>(
        string | Component<Props>,
    ) => Component<$Diff<Props, BEMEntityProps>>,
};

/**
 * BEM factory provider.
 * Can be used to generate BEM HOCs from BEM CSS.
 */
export function BEM(styles: CSSModule): BEMFactory {
  if (!styles || Object.keys(styles).length === 0) {
    throw new Error('[BEM] No class names found. Nothing to parse.');
  }
  const [blockName, blockModifiers] = findoutBlockDescriptor(styles);
  const ctx = createBlockContext({ name: blockName, styles });
  const elementDescriptors = findoutElementDescriptors(styles);
  return Object.assign(
    (block(ctx)(modifiersListToModifiersMap(blockModifiers)) : any),
    ...elementDescriptors.map(([elementName, elementModifiers]) => {
      const elementHOC = element(ctx)(
        elementName,
        modifiersListToModifiersMap(elementModifiers),
      );
      return {
        [elementName]: elementHOC,
        [kebabToCamelCase(elementName)]: elementHOC,
      };
    }),
  );
}
