const path = require('path');
const tsconfigPathsWebpackPlugin = require('tsconfig-paths-webpack-plugin');
const webpackNodeExternals = require('webpack-node-externals');
const webpackBar = require('webpackbar');
const CopyPlugin = require('copy-webpack-plugin');

const sourcePath = path.resolve(path.join(__dirname, '..'));
const distPath = path.resolve(path.join(__dirname, '..', 'dist'));

const config = {
  devtool: 'inline-source-map',
  externals: [
    webpackNodeExternals({
      allowlist: ['tslib'],
    }),
  ],
  mode: 'development',
  target: 'node',

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    fallback: {
      __filename: false,
      global: false,
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    plugins: [
      new tsconfigPathsWebpackPlugin({
        configFile: 'tsconfig.json',
      }),
    ],
  },

  plugins: [new webpackBar({ name: '-maeum-boilerplate' })],

  entry: {
    maeum: ['./src/listen.ts'],
  },

  output: {
    filename: 'maeum.js',
    libraryTarget: 'commonjs',
    path: distPath,
  },

  optimization: {
    minimize: false, // <---- disables uglify.
    // minimizer: [new UglifyJsPlugin()] if you want to customize it.
  },

  module: {
    rules: [
      {
        loader: 'json-loader',
        test: /\.json$/,
      },
      {
        exclude: /node_modules/,
        loader: 'ts-loader',
        test: /\.tsx?$/,
        options: {
          configFile: 'tsconfig.json',
        },
      },
    ],
  },

  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.join(sourcePath, 'src', 'config', 'files'),
          to: path.join(distPath, 'src', 'config', 'files'),
        },
        { from: path.join(sourcePath, 'resources'), to: path.join(distPath, 'resources') },
        { from: path.join(sourcePath, '.config'), to: path.join(distPath, '.config') },
        { from: path.join(sourcePath, 'package.json'), to: path.join(distPath, 'package.json') },
        {
          from: path.join(sourcePath, 'package-lock.json'),
          to: path.join(distPath, 'package-lock.json'),
        },
      ],
    }),
  ],

  node: {
    __dirname: true,
  },
};

module.exports = config;
