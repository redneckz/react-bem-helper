import {Config} from '../config';

export function assertion(validator, message = 'Assertion error', enabled = isAssertableTarget) {
    if (typeof validator === 'string') {
        return assertion(() => false, validator, enabled);
    }
    return (target, ...args) => {
        const assertionEnabled = Config.ASSERTION_ENABLED && enabled(target, ...args);
        if (assertionEnabled && !validator(target, ...args)) {
            throw new Error(`[BEM] ${message}`);
        }
    };
}

export function disableAssertionOnTarget(target) {
    // eslint-disable-next-line no-param-reassign
    target.assertion = false;
}

function isAssertableTarget(target) {
    return !target || (target.assertion !== false);
}
