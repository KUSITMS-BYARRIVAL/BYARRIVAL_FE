const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier/flat");
const pluginQuery = require("@tanstack/eslint-plugin-query");

module.exports = defineConfig([
  globalIgnores(["dist/*", ".expo/*"]),
  expoConfig,
  ...pluginQuery.configs["flat/recommended"],
  // Prettier와 충돌하는 포맷팅 규칙을 끄므로 항상 마지막에 둔다
  eslintConfigPrettier,
]);
