import {baseBlock} from './base-block';

/**
 * Alternative block decorator. Very similar to @block.
 * React context API usage (see https://facebook.github.io/react/docs/context.html)
 * is disabled and replaced with static context. This leads to deprivation of
 * standalone @element support.
 * Use namespaced @element instead. For example:
 *
 * import {plainBlock as block} from '@redneckz/react-bem-helper';
 *
 * const Foo = block('foo')('div');
 * const Bar = Foo.element('bar')('div');
 *
 * Also namespaced @element can be used with standart @block
 * in complicated cases like the following:
 *
 * const BlockA = block('block-a')(() => (
 *     <BlockB>
 *         <ElementA />
 *         <ElementB />
 *     </BlockB>
 * ));
 * const ElementA = element('element-a')('div');        // standalone @element
 * const ElementB = BlockA.element('element-b')('div'); // namespaced @element
 *
 * ElementA is erroneously bound to BlockB. ElementB works just fine.
 *
 * @param {string} blockName
 * @param {Props -> Modifiers} [mapPropsToModifiers]
 * @param {{styles: Object}} [options]
 * @return {Component -> Component} decorator
 */
export function plainBlock(blockName, mapPropsToModifiers, options) {
    if (typeof mapPropsToModifiers === 'object') {
        // Alternative signature
        return plainBlock(blockName, undefined, mapPropsToModifiers);
    }
    return baseBlock(blockName, mapPropsToModifiers, options);
}
