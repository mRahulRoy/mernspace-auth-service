/** @type {import('ts-jest').JestConfigWithTsJest} */
// fix the below lint error its a temorary fix
// eslint-disable-next-line no-undef
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    verbose: true,
    // here we are enabling the test coverage
    collectCoverage: true,
    coverageProvider: 'v8',
    //Mentioning here which file/folder to include and exclude in the coverage.
    collectCoverageFrom: ['src/**/*.ts', '!tests/**', '!**/node_modules/**' , "!src/types/**"  ],
};
