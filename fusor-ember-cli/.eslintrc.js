////////////////////////////////////////////////////////////
// Default config
// TODO: Starting out just validating double space indents
// Will gradually introduce other rules
// Removing eslint:recommended and overrides
////////////////////////////////////////////////////////////
/*

module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "indent": [
      "error",
      2
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "error",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
};

*/

////////////////////////////////////////////////////////////
// Current Config
//
// NOTE: Following key should be added back in to include
// base recommended rules. We've pulled it to only validate
// indentation.
//
// "extends": "eslint:recommended",
//
////////////////////////////////////////////////////////////

const rulesOverrides = {
  "indent": [
    "error",
    2
  ],
};

module.exports = {
  "env": {
    "browser": true,
    "es6": true
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": rulesOverrides
};
