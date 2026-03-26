const nextJest = require("next/jest");

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.integration.test.js"],
  clearMocks: true,
};

module.exports = createJestConfig(customJestConfig);
