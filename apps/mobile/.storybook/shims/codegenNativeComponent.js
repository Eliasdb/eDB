// Minimal web-safe stub for RN's codegenNativeComponent
import * as React from 'react';

export default function codegenNativeComponent(/* name, options */) {
  // Return a very basic host component that renders a <div>.
  return React.forwardRef(function RNCodegenStub(props, ref) {
    const { style, ...rest } = props ?? {};
    return React.createElement('div', { ref, style, ...rest });
  });
}
