/** @type {import('jest').Config} */
export default {
  displayName: "api",
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests/api"],
  testMatch: ["**/*.test.ts"],
  moduleFileExtensions: ["ts", "js", "json"],
  testTimeout: 30000,
};
