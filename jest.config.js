module.exports = {
    "moduleNameMapper": {
        "(.*)Mock$": "<rootDir>/test/__mocks__/$1Mock.js"
    },
    "collectCoverageFrom": [
        "lib/**/*.js",
    ],
    "coverageReporters": [
        "json",
        "lcov",
        "text",
        "html"
    ],
    "coverageThreshold": {
        "global": {
            "branches": 96,
            "functions": 96,
            "lines": 96,
            "statements": 96
        },
    },
    "setupTestFrameworkScriptFile": "<rootDir>/test/jestSetup.js",
    "modulePaths": [
        "<rootDir>/lib"
    ]
};
