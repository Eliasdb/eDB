// Minimal Expo config plugin to set iOS build settings for all targets
const { withXcodeProject } = require('@expo/config-plugins');

module.exports = function withIosBuildSettings(config) {
  return withXcodeProject(config, (config) => {
    const project = config.modResults;

    // Set iOS deployment target to 16.0 for all configurations
    const configurations = project.pbxXCBuildConfigurationSection();
    for (const key in configurations) {
      const cfg = configurations[key];
      if (!cfg || !cfg.buildSettings) continue;
      cfg.buildSettings.IPHONEOS_DEPLOYMENT_TARGET = '16.0';
      // Disable user script sandboxing (fixes "bash deny file-write-create" from Pods)
      cfg.buildSettings.ENABLE_USER_SCRIPT_SANDBOXING = 'NO';
    }

    return config;
  });
};
