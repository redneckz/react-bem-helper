// @flow
import React from 'react';
import type { CSSModule } from './bem-helper-types';

export type BlockContext = {|
    name: string,
    styles: CSSModule | void,
    modifiersContext: $Call<typeof React.createContext, string>,
|};

const blockContextsMap: { [string]: BlockContext } = {};

export function createBlockContext({
    name,
    styles,
}: {
    name: string,
    styles?: CSSModule | void,
}): BlockContext {
    if (!blockContextsMap[name]) {
        blockContextsMap[name] = {
            name,
            styles,
            modifiersContext: React.createContext(),
        };
    }
    return blockContextsMap[name];
}
