// @flow
import * as Tags from './tag';
import * as Modifiers from './modifier';

export { BEMConfig } from './bem-config';
export { BEM } from './bem';
export { createBlockContext } from './create-block-context';

export { block } from './block';
export { element, transparent } from './element';
export {
  modifier, is, startsWith, and, or, not,
} from './modifier';
export { Modifiers }; // Namespape

export {
  tag, div, span, form, button, input, label, textarea,
} from './tag';
export { Tags }; // Namespape

export {
  pick,
  capitalize,
  decapitalize,
  kebabCase,
  kebabToCamelCase,
  classNamesList,
} from './utils';

export type {
  CSSModule,
  HOC,
  Component,
  DOMComponent,
  DOMAttrs,
  BEMEntityProps,
  BEMEntityHOC,
} from './bem-helper-types';
