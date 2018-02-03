import {baseBlock} from './base-block';
import {plainBlock} from './plain-block';

jest.mock('./base-block', () => ({
    baseBlock: jest.fn()
}));

describe('BEM plain block decorator', () => {
    beforeEach(() => {
        baseBlock.mockReset();
    });

    it('should transparently delegate call to baseBlock', () => {
        const mapPropsToModifiers = () => {};
        const options = {};
        plainBlock('foo', mapPropsToModifiers, options);
        expect(baseBlock).toBeCalledWith('foo', mapPropsToModifiers, options);
    });

    it('should take options as second arg (overloaded version)', () => {
        const options = {};
        plainBlock('foo', options);
        expect(baseBlock).toBeCalledWith('foo', undefined, options);
    });
});
