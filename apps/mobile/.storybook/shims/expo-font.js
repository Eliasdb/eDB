// Minimal web/no-op shim for Storybook
export async function loadAsync() {
  /* no-op */
}
export function isLoaded() {
  return true;
}
export function processFontFamily(name) {
  return name;
}

export default { loadAsync, isLoaded, processFontFamily };
