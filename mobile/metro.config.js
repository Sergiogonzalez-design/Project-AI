const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const config = getDefaultConfig(__dirname);

const expoFontDir = path.resolve(__dirname, "node_modules/expo-font");

config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules ?? {}),
  "expo-font": expoFontDir,
};

module.exports = config;
