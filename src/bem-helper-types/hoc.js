// @flow
import type { Component } from './component';

export type UnaryFn<A, R> = (a: A) => R;
export type HOC<A, R> = UnaryFn<string | Component<A>, Component<R>>;
