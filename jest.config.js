/* eslint-disable @typescript-eslint/no-var-requires */

const { pathsToModuleNameMapper } = require('ts-jest');
const { parse } = require('jsonc-parser');
const path = require('path');
const fs = require('fs');

const tsconfig = parse(fs.readFileSync(path.join(__dirname, 'tsconfig.json')).toString());

module.exports = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  verbose: false,
  silent: false,
  testMatch: ['**/__tests__/*.(ts|tsx)', '**/__test__/*.(ts|tsx)'],
  testPathIgnorePatterns: ['/node_modules/', 'example/', 'dist/'],
  setupFilesAfterEnv: ['./.config/jest.setup.js'],
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/',
  }),
};
