export const environment = {
  production: false,
  // Point at the local admin MFE dev server so the host can register the remote manifest.
  mfManifestBaseUrl: 'http://localhost:4300',
  // Enable remotes in dev so loadRemote works when hitting /admin.
  mfEnableRemotes: true,
};
