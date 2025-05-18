import { withModuleFederation } from '@nx/module-federation/angular';
import { join } from 'path';
import mf from './module-federation.config';

export default async function (config, context) {
  const applyMf = await withModuleFederation(mf, { dts: false });
  const merged = applyMf(config);

  // ✅ Prevent unnecessary reloads
  merged.devServer = {
    ...merged.devServer,
    hot: true,
    liveReload: false,
    static: { directory: process.cwd(), watch: false },
    watchFiles: {
      paths: ['apps/eDB/src/**/*', 'libs/**/src/**/*'],
      options: {
        ignored: ['**/node_modules/**', '**/dist/**', '**/.angular/**'],
        usePolling: false, // or true only if needed
      },
    },
  };

  // ✅ Strip import.meta with Babel for emitted `.js`
  merged.module.rules.push({
    test: /\.m?js$/,
    include: [join(__dirname, '../../')],
    use: {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        configFile: false,
        presets: [],
        plugins: ['@babel/plugin-syntax-import-meta'], // no transform plugin needed
      },
    },
  });

  // ✅ Output tweaks for development vs production
  if (context?.configuration === 'production') {
    merged.output.chunkFilename = 'chunks/[name].[contenthash].js';
  } else {
    Object.assign(merged.output, { module: true });
    merged.experiments = {
      ...merged.experiments,
      outputModule: true,
    };
  }

  // ✅ Required for module type loading via <script type="module">
  merged.plugins.forEach((plugin) => {
    if (plugin.constructor.name === 'HtmlWebpackPlugin') {
      plugin.options.scriptLoading = 'module';
    }
  });

  return merged;
}
