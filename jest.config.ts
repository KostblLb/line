import { Config } from "jest";

const config: Config = {
  rootDir: ".",
  transform: { "^.+\\.ts?$": ["ts-jest", { tsconfig: "tests/tsconfig.json" }] },
  testEnvironment: "node",
  testRegex: "/tests/.*\\.(test|spec)?\\.(ts|tsx)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "src/(.*)": "<rootDir>/src/$1",
    "tests/(.*)": "<rootDir>/tests/$1",
  },
};

export default config;
