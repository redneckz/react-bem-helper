// @flow
import { stringifyBooleanProps } from './stringify-boolean-props';

describe('stringifyBooleanProps', () => {
    it('should transform boolean properties to string', () => {
        expect(stringifyBooleanProps({ foo: true })).toEqual({ foo: 'true' });
        expect(stringifyBooleanProps({ foo: true, bar: 1 })).toEqual({
            foo: 'true',
            bar: 1,
        });
    });

    it('should NOT transform standard boolean DOM attributes', () => {
        expect(stringifyBooleanProps({ foo: true, checked: true, disabled: false })).toEqual({
            foo: 'true',
            checked: true,
            disabled: false,
        });
    });

    it('should return object literal if null provided', () => {
        expect(stringifyBooleanProps(undefined)).toEqual({});
        expect(stringifyBooleanProps({})).toEqual({});
    });
});
