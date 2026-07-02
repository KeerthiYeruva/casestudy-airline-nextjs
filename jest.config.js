import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/e2e/",
    "<rootDir>/playwright-report/",
    "<rootDir>/test-results/",
  ],
};

export default createJestConfig(customJestConfig);
