// @flow
import React from 'react';
import { classNamesList } from '../utils';
import { elementClassNames } from '../bem-naming-factory';
import type { CSSModule, BEMEntityHOC } from '../bem-helper-types';
import type { BlockContext } from '../create-block-context';

type ModifiersMap<Props> = (Props, blockModifiers?: string[]) => any;

/**
 * HOC to declare BEM elements.
 * Injects [className] and [data-modifiers].
 *
 * Usage:
 *
 * import { block, element, pick, createBlockContext } from '@redneckz/react-bem-helper';
 *
 * const ctx = createBlockContext({ name: 'foo' });
 * const Foo = block(ctx)()('div');
 * const Bar = element(ctx)(
 *     'bar',
 *     pick(['quux', 'plugh']), // modifiers
 * )('div');
 *
 * <Foo>
 *     <Bar quux plugh>123</Bar>
 * </Foo>
 */
export function element(context: BlockContext) {
    const { name: blockName, styles: blockStyles, modifiersContext: ModifiersContext } = context;
    return <Props: { className?: string }>(
        elementName: string,
        modifiersMap?: ModifiersMap<Props> = () => {},
        options?: { styles?: CSSModule } = {},
    ): BEMEntityHOC<Props> => (ElementComponent) => {
        const { styles } = options;
        function ElementWrapper(props: Props) {
            const { className } = props;
            return (
                <ModifiersContext.Consumer>
                    {(blockModifiers) => {
                        const elementNamesList = elementClassNames(blockName, elementName);
                        const blockModifiersList = classNamesList()(blockModifiers);
                        const modifiers = classNamesList()(modifiersMap(props, blockModifiersList));
                        return (
                            <ElementComponent
                                {...props}
                                className={classNamesList(styles || blockStyles)(
                                    elementNamesList(modifiers),
                                    className, // BEM mixin
                                ).join(' ')}
                                data-modifiers={modifiers.join(' ')}
                            />
                        );
                    }}
                </ModifiersContext.Consumer>
            );
        }
        ElementWrapper.displayName = `element(${elementName})`;
        return ElementWrapper;
    };
}

/**
 * Creates modifiers map transparently applying all block modifiers to element
 * Usage:
 *
 * const Bar = element(ctx)(
 *     'bar',
 *     transparent(),
 * )('div');
 *
 * <Foo quux plugh>
 *     <Bar>123</Bar> <!-- "quux" and "plugh" will be applied -->
 * </Foo>
 */
export function transparent<Props>(map?: ModifiersMap<Props> = () => {}): ModifiersMap<Props> {
    return (props, blockModifiersList) => [map(props), blockModifiersList];
}
