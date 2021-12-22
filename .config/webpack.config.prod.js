const tsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const { merge } = require('webpack-merge');
const devConfig = require('./webpack.config.dev');

const config = merge(devConfig, {
  mode: 'production',
  target: 'node',

  resolve: {
    plugins: [
      new tsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.prod.json',
      }),
    ],
  },
});

module.exports = config;
