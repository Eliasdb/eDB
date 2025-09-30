// Re-export React's jsx-runtime so the preset's rewritten imports resolve.
export * from 'react/jsx-runtime';

// Some builds look for this symbol; map it to jsx.
export { jsx as createInteropElement } from 'react/jsx-runtime';
