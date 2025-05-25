import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import js from "@eslint/js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // JavaScript 기본 권장 설정
  js.configs.recommended,

  // Next.js 설정 (TypeScript 지원 포함)
  ...compat.extends("next/core-web-vitals"),

  // 전역 규칙 설정
  {
    rules: {
      // 사용하지 않는 변수 처리 (언더스코어로 시작하는 변수는 허용)
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      // React 권장 규칙 (React 17+ 최적화)
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off", // TypeScript 사용시 불필요
      "react/display-name": "warn",

      // React Hooks 규칙
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // 코드 품질 규칙
      "no-console": "warn",
      "no-debugger": "error",
      "no-duplicate-imports": "error",
      "prefer-const": "error",
      "no-var": "error",

      // 코드 스타일 규칙 (Prettier와 충돌하지 않는 것들만)
      eqeqeq: ["error", "always"],
      curly: ["error", "all"],

      // Next.js 특화 규칙
      "@next/next/no-img-element": "error",
      "@next/next/no-html-link-for-pages": "error",
    },
  },

  // 설정 파일들에 대한 예외
  {
    files: ["*.config.{js,ts,mjs}", "*.setup.{js,ts}", "tailwind.config.*"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },

  // 테스트 파일들에 대한 예외
  {
    files: ["**/*.{test,spec}.{js,ts,jsx,tsx}", "**/__tests__/**/*"],
    rules: {
      "no-console": "off",
      "no-unused-vars": "off",
    },
  },
];

export default eslintConfig;
