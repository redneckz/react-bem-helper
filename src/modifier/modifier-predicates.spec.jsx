// @flow
import {
  is, startsWith, and, or, not,
} from './modifier-predicates';

describe('Modifier predicates', () => {
  describe('[is]', () => {
    it('should be true if particular modifier is active', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(is('quux')(modifiersList)).toBe(true);
    });

    it('should be false if particular modifier is INactive', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(is('abc')(modifiersList)).toBe(false);
    });

    it('should be false if there are NO active modifiers', () => {
      expect(is('abc')([])).toBe(false);
    });
  });

  describe('[startsWith]', () => {
    it('should be true if there are active modifiers with particular prefix', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(startsWith('qu')(modifiersList)).toBe(true);
    });

    it('should be false if there are NO modifiers with particular prefix', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(startsWith('u')(modifiersList)).toBe(false);
    });

    it('should be false if there are NO active modifiers', () => {
      expect(startsWith('qu')([])).toBe(false);
    });
  });

  describe('[and]', () => {
    it('should become transparent if the only predicate provided', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(and(is('quux'))(modifiersList)).toBe(true);
      expect(and(is('abc'))(modifiersList)).toBe(false);
      expect(and(is('quux'))([])).toBe(false);
    });

    it('should be true if all predicates evaluate to true', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(and(is('quux'), is('plugh'))(modifiersList)).toBe(true);
    });

    it('should be false if some predicates evaluate to false', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(and(is('quux'), is('abc'))(modifiersList)).toBe(false);
    });

    it('should be true if NO predicates provided', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(and()(modifiersList)).toBe(true);
    });
  });

  describe('[or]', () => {
    it('should become transparent if the only predicate provided', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(or(is('quux'))(modifiersList)).toBe(true);
      expect(or(is('abc'))(modifiersList)).toBe(false);
      expect(or(is('quux'))([])).toBe(false);
    });

    it('should be true if some predicates evaluate to true', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(or(is('quux'), is('plugh'))(modifiersList)).toBe(true);
      expect(or(is('quux'), is('abc'))(modifiersList)).toBe(true);
    });

    it('should be false if all predicates evaluate to false', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(or(is('abc'), is('def'))(modifiersList)).toBe(false);
    });

    it('should be false if NO predicates provided', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(or()(modifiersList)).toBe(false);
    });
  });

  describe('[not]', () => {
    it('should invert provided predicate', () => {
      const modifiersList = ['quux', 'plugh'];
      expect(not(is('quux'))(modifiersList)).toBe(false);
      expect(not(is('abc'))(modifiersList)).toBe(true);
    });
  });
});
