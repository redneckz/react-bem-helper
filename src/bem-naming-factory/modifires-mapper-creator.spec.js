import {createModifiersMapper} from './modifiers-mapper-creator';
import {Config} from '../config';

Config.ASSERTION_ENABLED = true;

const {MODIFIER_SEPARATOR} = Config;
const INVALID_STRING_MODIFIERS = [' ', '*--*', 'кирилица', '4-start-with-digit'];
const MODIFIERS_WITH_INAPPROPRIATE_TYPE = [22, true, null, /.*/, new Date(), NaN, () => {}, Symbol('symbol')];

describe('function which is created by createModifiersMapper([name]) ', () => {
    let modifiersMapper;
    beforeEach(() => {
        modifiersMapper = createModifiersMapper('foo');
    });

    it('should map all array items and object keys', () => {
        expect(modifiersMapper([
            'baz',
            {bar: true},
            ['arr',
                ['sub-arr']
            ]
        ])).toEqual([
            `foo${MODIFIER_SEPARATOR}baz`,
            {[`foo${MODIFIER_SEPARATOR}bar`]: true},
            [`foo${MODIFIER_SEPARATOR}arr`,
                [`foo${MODIFIER_SEPARATOR}sub-arr`]
            ]
        ]);
    });


    it('should ignore falsey items in the array of modifiers', () => {
        expect(modifiersMapper([undefined, 'baz', null, false, 0, '']))
            .toEqual([`foo${MODIFIER_SEPARATOR}baz`]);
    });

    it('should return [name] if modifier is undefined', () => {
        expect(modifiersMapper()).toEqual('foo');
    });

    it('should return [name] if modifier is an empty string', () => {
        expect(modifiersMapper('')).toEqual('foo');
    });

    it('should fail in case of the modifier is an invalid string ', () => {
        INVALID_STRING_MODIFIERS.forEach(modifierStr => expect(() => modifiersMapper(modifierStr)).toThrow());
    });

    it('should fail in case of the modifier has inappropriate type', () => {
        MODIFIERS_WITH_INAPPROPRIATE_TYPE.forEach(modifier => expect(() => modifiersMapper(modifier)).toThrow());
    });

    it('should transform modfiers to kebab-case', () => {
        expect(modifiersMapper('bazBarQuux')).toEqual(`foo${MODIFIER_SEPARATOR}baz-bar-quux`);
    });

    it('should work correctly if modifier contains digits', () => {
        expect(modifiersMapper(['md4', 'mdOffset2'])).toEqual([
            `foo${MODIFIER_SEPARATOR}md4`,
            `foo${MODIFIER_SEPARATOR}md-offset2`
        ]);
    });
});
