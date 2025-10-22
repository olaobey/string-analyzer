module.exports = {
  preset: 'ts-jest', // Use ts-jest to transpile TypeScript
  testEnvironment: 'node', // Use Node.js environment for testing
  transform: {
    '^.+\\.tsx?$': 'ts-jest', // Use ts-jest to handle TypeScript files
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'node'], // Handle TypeScript and JavaScript extensions
  globals: {
    'ts-jest': {
      isolatedModules: true, // For performance, disable type-checking in Jest tests
    },
  },
  transformIgnorePatterns: ['node_modules/(?!@nestjs)'], // If needed, allow transforming certain node_modules packages
};
