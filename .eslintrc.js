module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "amd": true,
    "mocha": true,
    "jasmine": true,
    "protractor": true
  },
  "extends": "airbnb-base",
  "globals": {
    "sinon": true,
    "inject": true,
    "should": true
  },

  "parserOptions": {
    "ecmaVersion": 6
  },

  "rules": {
    "comma-dangle": 0,
    "no-use-before-define": [ "error", { "functions": false, "classes": true } ],
    "no-console": ["error", {"allow": [ "warn", "error", "info", "debug", "log" ] } ],
    "no-param-reassign": ["error", { "props": false }],
    "radix": ["error", "as-needed"]
  }
};
