// jest.config.js
module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy'
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest'
  }
};
