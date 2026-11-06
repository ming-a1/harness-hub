/**
 * Host half of the Plugin Hub bundle.
 *
 * The hub carries no feature logic: it only contributes one Client panel that
 * collects other plugins' sidebar panels. Its Host side therefore has nothing to
 * mount — the capability comes from the plugins that are actually installed.
 */
export const name = 'harness-hub';

/** Nothing to start; the bundle exists for its Client half. */
export function apply() {}
