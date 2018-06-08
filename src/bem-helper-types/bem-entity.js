// @flow
import type { HOC } from './hoc';

export type BEMEntityProps = {
    className?: string,
    'data-modifiers': string | void,
};
export type BEMEntityHOC<Props> = HOC<Props, $Diff<Props, BEMEntityProps>>;
