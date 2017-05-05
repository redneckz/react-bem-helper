import {chooseModifierComponent} from './modifier-component-chooser';

describe('Modifier component chooser', () => {
    const Foo = {}; // default component
    const FooBar = {
        modifierPredicates: [({bar}) => bar]
    };
    const FooXyzzyPlugh = {
        modifierPredicates: [({xyzzy, plugh}) => xyzzy && plugh]
    };
    const FooQuux = {
        modifierPredicates: [
            normalizedModifiers => Object.keys(normalizedModifiers)
                .some(mod => /^quux-/.test(mod))
        ]
    };
    const ModifierComponents = [FooBar, FooXyzzyPlugh, FooQuux];
    const Components = [Foo, ...ModifierComponents];

    it('should return the only component regardless provided modifiers', () => {
        expect(chooseModifierComponent([Foo], {bar: true})).toBe(Foo);
    });

    it('should return appropriate component according to provided modifier', () => {
        expect(chooseModifierComponent(Components, {bar: true}))
            .toBe(FooBar);
        expect(chooseModifierComponent(Components, {xyzzy: true, plugh: true}))
            .toBe(FooXyzzyPlugh);
        expect(chooseModifierComponent(Components, {'quux-quux': true}))
            .toBe(FooQuux);
    });

    it('should return default component if nothing appropriate found', () => {
        expect(chooseModifierComponent(Components, {xyzzy: true})).toBe(Foo);
        expect(chooseModifierComponent(Components, {})).toBe(Foo);
        expect(chooseModifierComponent(Components)).toBe(Foo);
    });

    it('should fail if nothing appropriate found and no default cpomponent exists', () => {
        expect(() => chooseModifierComponent(ModifierComponents, {}))
            .toThrow(Error);
    });

    it('should fail if several components correspond to provided modifier', () => {
        expect(() => chooseModifierComponent([FooBar, FooBar], {bar: true}))
            .toThrow(Error);
    });
});
