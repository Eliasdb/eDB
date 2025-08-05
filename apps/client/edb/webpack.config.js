// apps/eDB/webpack.config.js

module.exports = (config) => {
  return {
    ...config,

    output: {
      ...config.output,
      // Customize the chunk naming pattern
      chunkFilename: 'chunks/[name].[contenthash].js',
    },
    // You can add more custom configurations here if needed
  };
};
