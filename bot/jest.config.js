module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  moduleNameMapper: {
    "^@abstracts(.*)$": "<rootDir>/src/abstracts$1",
    "^@models(.*)$": "<rootDir>/src/models$1",
    "^@services(.*)$": "<rootDir>/src/services$1"
  }
};
