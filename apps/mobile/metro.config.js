const path = require('path');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');
const { withNativeWind } = require('nativewind/metro');
const withStorybook = require('@storybook/react-native/metro/withStorybook');
// const { withNxMetro } = require('@nx/expo'); // only if you need Nx plugin wrapping

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../../'); // monorepo root

// Base Expo config for this app
const defaultConfig = getDefaultConfig(projectRoot);
const { assetExts, sourceExts } = defaultConfig.resolver;

// Force Metro to resolve React & RN from THIS app (prevents duplicate React)
const forceAppModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
};

const customConfig = {
  cacheVersion: 'mobile',
  transformer: {
    // keep SVG support
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'cjs', 'mjs', 'svg'],

    // key bits to avoid duplicate React in a monorepo
    disableHierarchicalLookup: true,
    nodeModulesPaths: [
      path.resolve(projectRoot, 'node_modules'),
      path.resolve(workspaceRoot, 'node_modules'),
    ],
    extraNodeModules: forceAppModules,
  },
  // watch the workspace so shared packages rebuild
  watchFolders: [workspaceRoot],
};

// Merge base + custom
const merged = mergeConfig(defaultConfig, customConfig);

// Wrap with NativeWind (always)
let finalConfig = withNativeWind(merged, { input: './global.css' });

// If we’re running Storybook, wrap again
finalConfig = withStorybook(finalConfig, {
  enabled: process.env.EXPO_PUBLIC_STORYBOOK === '1',
  configPath: path.resolve(__dirname, './.rnstorybook'),
});

module.exports = finalConfig;
