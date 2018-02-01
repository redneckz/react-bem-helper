import classNames from 'classnames/bind';

export function normalizeModifiers(modifiers) {
    if (!modifiers) {
        return {};
    }
    if (typeof modifiers !== 'string') {
        return normalizeModifiers(classNames(modifiers));
    }
    const modifiersList = modifiers.split(' ');
    return Object.assign(
        ...modifiersList.map(modifier => ({
            [modifier]: true
        }))
    );
}
