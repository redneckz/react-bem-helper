export const is = mod => modifiersList => (modifiersList.indexOf(mod) !== -1);

export const startsWith = prefix => modifiersList => modifiersList.some(
    m => (m.indexOf(prefix) === 0)
);

export const and = (...predicates) => modifiersList => predicates.every(
    p => p(modifiersList)
);

export const or = (...predicates) => modifiersList => predicates.some(
    p => p(modifiersList)
);

export const not = predicate => modifiersList => !predicate(modifiersList);
