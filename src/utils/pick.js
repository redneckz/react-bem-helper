export function pick(keysList) {
    if (!Array.isArray(keysList) || (keysList.length === 0)) {
        return () => ({});
    }
    return (props) => {
        const filteredProps = props
            ? keysList
                .filter(key => key in props)
                .map(key => ({
                    [key]: props[key]
                }))
            : [];
        return Object.assign({}, ...filteredProps);
    };
}
