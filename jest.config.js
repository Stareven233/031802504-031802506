module.exports = {
  preset: '@vue/cli-plugin-unit-jest',
  "collectCoverage": true,
  "collectCoverageFrom": ["src/*.{js,vue}", "./babel.config.js", "jest.config.js"],
  "moduleFileExtensions": ["js", "vue"]
}
