export function isBlockDefinition(Component) {
    return Component && /^block\(.+\)$/.test(Component.displayName);
}
