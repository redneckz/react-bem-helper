import isString from 'lodash/isString';
import stubFalse from 'lodash/stubFalse';
import {Config} from './config';

export function assertion(validator, message) {
    if (isString(validator)) {
        return assertion(stubFalse, validator);
    }
    return (...args) => {
        if (Config.ASSERTION_ENABLED && !validator(...args)) {
            throw new Error(`[BEM] ${message}: ${JSON.stringify(args)}`);
        }
    };
}
