// export default {
//   displayName: 'utils',
//   preset: 'jest-preset-angular', // Ensure this is properly used
//   setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
//   coverageDirectory: '../../coverage/libs/utils',
//   extensionsToTreatAsEsm: ['.ts'], // Treat .ts and .mjs as ESM
//   transform: {
//     '^.+\\.(ts|js|html)$': [
//       'ts-jest',
//       {
//         useESM: true, // Enable ESM support in ts-jest
//         tsconfig: '<rootDir>/tsconfig.spec.json',
//       },
//     ],
//     '^.+\\.mjs$': 'babel-jest', // Use babel-jest for .mjs files
//   },

//   transformIgnorePatterns: [
//     'node_modules/(?!.*\\.(mjs|js)$)', // Allow .mjs and .js files in all node_modules
//     'node_modules/(?!(@angular|rxjs|zone.js|jest-preset-angular|lodash-es|@carbon)/)', // Include specific packages
//   ],

//   snapshotSerializers: [
//     'jest-preset-angular/build/serializers/no-ng-attributes',
//     'jest-preset-angular/build/serializers/ng-snapshot',
//     'jest-preset-angular/build/serializers/html-comment',
//   ],
// };
