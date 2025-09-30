// ---- flatten any array styles that reach DOM (prevents "indexed property setter" crash)
import React from 'react';
import { StyleSheet } from 'react-native';
const __createElement = React.createElement;
React.createElement = (type, props, ...children) => {
  if (props && Array.isArray(props.style)) {
    props = { ...props, style: StyleSheet.flatten(props.style) };
  }
  return __createElement(type, props, ...children);
};
// ------------------------------------------------------------------------------

import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';

export const decorators = [
  (Story) => (
    <SafeAreaProvider>
      <div style={{ padding: 16, background: 'var(--sb-bg, #f6f7fb)' }}>
        <Story />
      </div>
    </SafeAreaProvider>
  ),
];

export const parameters = {
  layout: 'fullscreen',
  controls: { expanded: true },
};
