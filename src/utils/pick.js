// @flow
type Optional = <V>(V) => V | void;

export function pick<O: {}>(
  keys?: string[] | null | void,
): (obj?: O | null | void) => $ObjMap<O, Optional> {
  return (obj) => {
    if (!keys || !obj) {
      return {};
    }
    const validKeys = keys.filter(key => key in obj);
    const filteredProps = validKeys.map(key => ({
      [key]: obj[key],
    }));
    return Object.assign({}, ...filteredProps);
  };
}
