// In MF production the host loads the exposed routes, so no standalone bootstrap is needed.
// Keep the dev bootstrap behind an env flag to avoid duplicating runtime in prod builds.
const isProd = process.env['NODE_ENV'] === 'production';
if (!isProd) {
  import('./bootstrap').catch((err) => console.error(err));
}
