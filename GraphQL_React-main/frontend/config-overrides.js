const { override, addBabelPlugin } = require('customize-cra');

module.exports = override(
  addBabelPlugin([
    '@babel/plugin-proposal-class-properties',
    { loose: true }
  ]),
  addBabelPlugin([
    '@babel/plugin-proposal-private-methods',
    { loose: true }
  ]),
  addBabelPlugin([
    '@babel/plugin-proposal-private-property-in-object',
    { loose: true }
  ])
);
