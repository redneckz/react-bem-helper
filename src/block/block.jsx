// @flow
import * as React from 'react';
import { classNamesList } from '../utils';
import { blockClassNames } from '../bem-naming-factory';
import type { BEMEntityHOC } from '../bem-helper-types';
import type { BlockContext } from '../create-block-context';

/**
 * HOC to declare BEM blocks.
 * Injects [className] and [data-modifiers].
 *
 * Usage:
 *
 * import { block, element, createBlockContext } from '@redneckz/react-bem-helper';
 *
 * const ctx = createBlockContext({ name: 'foo' });
 * const Foo = block(ctx)()('div');
 * const Bar = element(ctx)('bar')('div');
 *
 * <Foo>
 *     <Bar>123</Bar>
 * </Foo>
 */
export function block(context: BlockContext) {
  const { name, styles, modifiersContext: ModifiersContext } = context;
  return <Props: { className?: string }>(
    modifiersMap?: Props => any = () => {},
  ): BEMEntityHOC<Props> => (BlockComponent) => {
    function BaseBlockWrapper(props: Props) {
      const { className } = props;
      const modifiers = classNamesList()(modifiersMap(props));
      return (
        <ModifiersContext.Provider value={modifiers.join(' ')}>
          <BlockComponent
            {...props}
            className={classNamesList(styles)(
              blockClassNames(name)(modifiers),
              className, // BEM mixin
            ).join(' ')}
            data-modifiers={modifiers.join(' ')}
          />
        </ModifiersContext.Provider>
      );
    }
    BaseBlockWrapper.displayName = `block(${name})`;
    return BaseBlockWrapper;
  };
}
