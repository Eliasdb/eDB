// Minimal NativeWind shim for web/Storybook
export const styled = <P>(Comp: React.ComponentType<P>) => Comp;
export const useColorScheme = () => 'light';
export const cssInterop = (..._args: any[]) => {};
export default { styled, cssInterop, useColorScheme };
