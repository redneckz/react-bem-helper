import isString from 'lodash/isString';
import zipObject from 'lodash/zipObject';
import times from 'lodash/times';
import stubTrue from 'lodash/stubTrue';
import classNames from 'classnames/bind';

export function normalizeModifiers(modifiers) {
    if (!modifiers) {
        return {};
    }
    if (!isString(modifiers)) {
        return normalizeModifiers(classNames(modifiers));
    }
    const modifiersList = modifiers.split(' ');
    return zipObject(
        modifiersList,
        times(modifiersList.length, stubTrue)
    );
}
