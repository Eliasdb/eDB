// pnpmfile.js
module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.dependencies) {
        if (pkg.dependencies.webpack) {
          pkg.dependencies.webpack = '5.96.1'; // Use the Webpack version required by Storybook
        }
      }
      return pkg;
    },
  },
};
