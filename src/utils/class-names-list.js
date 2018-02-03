import classNames from 'classnames/bind';

/**
 * Wrapper around "classnames/bind" with slightly different output
 */
export function classNamesList(styles) {
    const cx = classNames.bind(styles || {});
    return (...args) => cx(...args).split(' ').filter(Boolean);
}
