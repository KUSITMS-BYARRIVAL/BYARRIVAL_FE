const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// .svg를 에셋이 아닌 컴포넌트로 import한다 (react-native-svg-transformer)
config.transformer.babelTransformerPath =
  require.resolve("react-native-svg-transformer/expo");
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== "svg",
);
config.resolver.sourceExts = [...config.resolver.sourceExts, "svg"];

module.exports = withNativeWind(config, { input: "./global.css" });
