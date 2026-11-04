const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintConfigPrettier = require("eslint-config-prettier/flat");
const pluginQuery = require("@tanstack/eslint-plugin-query");

module.exports = defineConfig([
  globalIgnores(["dist/*", ".expo/*"]),
  expoConfig,
  ...pluginQuery.configs["flat/recommended"],
  {
    rules: {
      // 같은 아이콘이 사용처마다 다른 이름을 갖지 않도록 assets/icons/index.ts의 이름만 쓰게 한다
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/assets/icons/*.svg"],
              message: '"@/assets/icons"에서 이름 있는 import로 가져오세요.',
            },
          ],
        },
      ],
    },
  },
  // Prettier와 충돌하는 포맷팅 규칙을 끄므로 항상 마지막에 둔다
  eslintConfigPrettier,
]);
