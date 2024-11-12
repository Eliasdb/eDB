const {
  withNativeFederation,
  shareAll,
} = require("@angular-architects/native-federation/config");

module.exports = withNativeFederation({
  name: "client",

  exposes: {
    "./Component": "./src/app/app.component.ts",
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: "auto",
    }),
  },

  skip: [
    "rxjs/ajax",
    "rxjs/fetch",
    "rxjs/testing",
    "rxjs/webSocket",
    // Add further packages you don't need at runtime
  ],

  remotes: {
    appointments: "appointments@http://localhost:4201/assets/remoteEntry.js",
  },

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0
});
