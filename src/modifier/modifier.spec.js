import {modifier} from './modifier';

describe('BEM modifier decorator', () => {
    let FooQuux;
    beforeEach(() => {
        FooQuux = () => {};
    });

    it('should define static field [modifierPredicates]', () => {
        const WrappedFooQuux = modifier('quux')(FooQuux);
        expect(WrappedFooQuux.modifierPredicates).toBeTruthy();
    });

    it('should support string-based modifier predicates', () => {
        const WrappedFooQuux = modifier('quux')(FooQuux);
        expect(WrappedFooQuux.modifierPredicates).toHaveLength(1);
        const stringBasedPredicate = WrappedFooQuux.modifierPredicates[0];
        expect(stringBasedPredicate).toBeInstanceOf(Function);
        const normalizedModifiers = {quux: true};
        expect(stringBasedPredicate(normalizedModifiers)).toBeTruthy();
        expect(stringBasedPredicate({baz: true})).toBeFalsy();
    });

    it('should support regexp-based modifier predicates', () => {
        const WrappedFooQuux = modifier(/^size-(xs|sm|lg)$/)(FooQuux);
        expect(WrappedFooQuux.modifierPredicates).toHaveLength(1);
        const regexpBasedPredicate = WrappedFooQuux.modifierPredicates[0];
        expect(regexpBasedPredicate).toBeInstanceOf(Function);
        expect(regexpBasedPredicate({'size-xs': true})).toBeTruthy();
        expect(regexpBasedPredicate({'size-lg': true})).toBeTruthy();
        expect(regexpBasedPredicate({'size-nn': true})).toBeFalsy();
    });

    it('should support regular predicates', () => {
        const WrappedFooQuux = modifier(({quux}) => quux)(FooQuux);
        expect(WrappedFooQuux.modifierPredicates).toHaveLength(1);
        const predicate = WrappedFooQuux.modifierPredicates[0];
        expect(predicate).toBeInstanceOf(Function);
        const normalizedModifiers = {quux: true};
        expect(predicate(normalizedModifiers)).toBeTruthy();
        expect(predicate({baz: true})).toBeFalsy();
    });

    it('should fail if no modifier predicates provided', () => {
        expect(() => modifier()(FooQuux)).toThrow(TypeError);
    });

    it('should fail if invalid modifier predicate provided', () => {
        expect(() => modifier(123)(FooQuux)).toThrow(TypeError);
        expect(() => modifier(true)(FooQuux)).toThrow(TypeError);
        expect(() => modifier({})(FooQuux)).toThrow(TypeError);
        expect(() => modifier([])(FooQuux)).toThrow(TypeError);
    });
});
