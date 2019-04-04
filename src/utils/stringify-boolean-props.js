// @flow

const BOOLEAN_DOM_ATTRIBUTES = ['checked', 'selected', 'disabled', 'readonly', 'multiple', 'ismap'];

export function stringifyBooleanProps(obj?: {} = {}): { [string]: mixed } {
    return Object.entries(obj).reduce(
        (acc, [key, value]) =>
            (typeof obj[key] === 'boolean' && !BOOLEAN_DOM_ATTRIBUTES.includes(key)
                ? { ...acc, [key]: String(value) }
                : { ...acc, [key]: value }),
        {},
    );
}
