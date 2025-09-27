// apps/mobile/metro.config.js
const path = require('path');
const { withNxMetro } = require('@nx/expo');
const { getDefaultConfig } = require('@expo/metro-config');
const { mergeConfig } = require('metro-config');
const { withNativeWind } = require('nativewind/metro');

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

// Merge base + custom, then wrap with Nx, then wrap with NativeWind
const merged = mergeConfig(defaultConfig, customConfig);

module.exports = withNativeWind(merged, { input: './global.css' });
