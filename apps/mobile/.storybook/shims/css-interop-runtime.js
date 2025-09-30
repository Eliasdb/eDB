// Minimal runtime so stories render even if something imports
// `react-native-css-interop` for JSX.
import React from 'react';
import { StyleSheet } from 'react-native';

// Matches the "automatic JSX" runtime style: (type, props, key)
export function createInteropElement(type, props, key) {
  // Flatten array styles to avoid RNW DOM warnings
  if (props && Array.isArray(props.style)) {
    props = { ...props, style: StyleSheet.flatten(props.style) };
  }
  // React handles "key" in props; ensure it's set if provided
  if (key != null && props && props.key == null) {
    props = { ...props, key };
  }
  return React.createElement(type, props);
}

// Keep a no-op export to satisfy other callers
export const cssInterop = () => {};

export default { createInteropElement, cssInterop };
