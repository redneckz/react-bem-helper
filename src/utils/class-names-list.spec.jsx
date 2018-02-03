import {classNamesList} from './class-names-list';

describe('classNamesList', () => {
    it('should compute class names from array values and from object keys with truthy values', () => {
        expect(classNamesList()([
            'baz',
            {bar: true},
            {quux: false},
            ['arr',
                ['sub-arr']
            ]
        ])).toEqual(['baz', 'bar', 'arr', 'sub-arr']);
    });

    it('should ignore falsey array values', () => {
        expect(classNamesList()([undefined, 'baz', null, false, 0, '']))
            .toEqual(['baz']);
    });

    it('should return empty array if nothing specified', () => {
        expect(classNamesList()()).toEqual([]);
    });

    it('should return empty array if empty string specified', () => {
        expect(classNamesList()('')).toEqual([]);
    });
});
