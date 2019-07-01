// @flow
export type ModifierPredicate = (string[]) => boolean;

export const is: string => ModifierPredicate = mod => modifiersList => (
  modifiersList.indexOf(mod) !== -1
);

export const startsWith: string => ModifierPredicate = prefix => modifiersList => (
  modifiersList.some(m => m.indexOf(prefix) === 0)
);

export const and: (...predicates: ModifierPredicate[]) => ModifierPredicate = (
  ...predicates
) => modifiersList => predicates.every(p => p(modifiersList));

export const or: (...predicates: ModifierPredicate[]) => ModifierPredicate = (
  ...predicates
) => modifiersList => predicates.some(p => p(modifiersList));

export const not: ModifierPredicate => ModifierPredicate = predicate => modifiersList => (
  !predicate(modifiersList)
);
