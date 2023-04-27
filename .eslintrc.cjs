import { off } from "process";

module.exports = {
  root: true,
  env: {
    jest: true,
  },
  extends: 'airbnb-base',
  rules: {
    'no-underscore-dangle': 'off',
    'no-param-reassign': 0,
    'no-return-assign': 'off',
    'no-trailing-spaces': 'off',
    'no-multiple-empty-lines': 'off',
    'linebreak-style': 'off',
    'comma-dangle': 'off',
    'import/extensions': 'off',
    'operator-linebreak': 'off',
    'consistent-return': 'off',
    semi: 'off',
    quotes: 'off',
    camelcase: 0,
  },
};
