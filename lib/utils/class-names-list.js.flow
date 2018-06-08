// @flow
import classNames from 'classnames/bind';
import type { CSSModule } from '../bem-helper-types';

/**
 * Wrapper around "classnames/bind" with slightly different output
 */
export function classNamesList(styles?: CSSModule = {}): (...mixed[]) => string[] {
    const boundClassNames: (...mixed[]) => string = classNames.bind(styles);
    return (...args) =>
        boundClassNames(...args)
            .split(' ')
            .filter(Boolean);
}
